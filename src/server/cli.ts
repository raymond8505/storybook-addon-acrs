import WebSocket from "ws";
import util from "util";
import { StoryScanResult } from "src/server/runScan";
function inspect(obj: Record<string, any>): string {
  return util.inspect(obj, {
    showHidden: false,
    depth: null,
    colors: true,
  });
}

console.log("Starting VPAT CLI...");

const ws = new WebSocket("ws://localhost:3000/vpat"); // Change URL as needed

ws.on("open", function open() {
  ws.send(
    JSON.stringify({
      action: "run-scan",
      payload: {
        //stories: ['ava-chatinterface--default'],
        options: { delivery: "send" },
      },
    }),
  );
});

ws.on("message", function message(dataStr) {
  const data = JSON.parse(String(dataStr));
  switch (data.action) {
    case "scan-progress":
      console.log(`Progress: ${data.payload.progress}%`);
      break;
    case "report-created":
      console.log(
        "Report created:",
        inspect(
          data.payload.report.results.map((r: StoryScanResult) => r.violations),
        ),
      );
      break;
    case "ready":
      console.log(
        "WebSocket is ready. Rule definitions and reports are available.",
      );
      break;
    default:
      console.log("Received message:", data);
  }
});

ws.on("close", function close() {
  console.log("WebSocket connection closed");
});

ws.on("error", function error(err) {
  console.error("WebSocket error:", err);
});
