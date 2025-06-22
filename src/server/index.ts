#!/usr/bin/env node
import express from "express";
const httpApp = express();
import expressWS from "express-ws";
const wsApp = express();
import { runScan } from "./runScan";
import { createReport } from "./createReport";
import cors from "cors";
import { getRuleDefinitions } from "./getRuleDefinitions";

import { readdirSync } from "fs";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

// @ts-expect-error
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

expressWS(wsApp);

// @ts-expect-error
const ruleDefinitions = await getRuleDefinitions();

function getAllReports() {
  const reports = [];
  const files = readdirSync(`${__dirname}/htdocs/reports`);
  for (const file of files) {
    if (file.endsWith(".json")) {
      reports.push(file.replace(".json", ""));
    }
  }

  return reports.reverse();
}
// @ts-expect-error
wsApp.ws("/vpat", function (ws, req) {
  ws.on("message", async function (msgStr: string) {
    const msg = JSON.parse(msgStr);

    switch (msg.action) {
      case "run-scan":
        const ids: string[] = msg.payload.stories;
        ws.send(
          JSON.stringify({
            action: "scan-progress",
            payload: {
              currentIndex: 0,
              currentId: "starting scan",
              total: ids.length,
              progress: 0,
            },
          }),
        );
        const report = await runScan(ids, {
          onProgress: (progress) => {
            ws.send(
              JSON.stringify({
                action: "scan-progress",
                payload: {
                  progress,
                },
              }),
            );
          },
        });

        const delivery = msg.payload.options?.delivery ?? "save";
        let id;
        if (delivery === "save") {
          id = createReport(report);
        }
        ws.send(
          JSON.stringify({
            action: "report-created",
            payload: {
              report:
                delivery === "save"
                  ? {
                      id,
                    }
                  : report,
            },
          }),
        );
        break;
    }
  });
  console.log("WebSocket connection opened");
  ws.send(
    JSON.stringify({
      action: "ready",
      payload: {
        ruleDefinitions,
        reports: getAllReports(),
      },
    }),
  );
});
httpApp.use(cors());
httpApp.use(express.static(`${__dirname}/../server/htdocs/reports`));

wsApp.listen(3000, () => {
  console.log("WebSocket server running at ws://localhost:3000/vpat");
  console.log("HTTP server running at http://localhost:3001");
});

httpApp.listen(3001);

export {};
