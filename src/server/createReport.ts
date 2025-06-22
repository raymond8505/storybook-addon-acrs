import { writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { type Result } from "axe-core";
import { ScanResult, StoryScanResult } from "src/server/runScan";
// @ts-expect-error
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function trimResult(result: Result): Partial<Result> {
  return {
    ...result,
    description: undefined,
    help: undefined,
    helpUrl: undefined,
    nodes: undefined,
  };
}
export function createReport({ results, errors, meta }: ScanResult) {
  const toSave: ScanResult = {
    errors,
    meta,
    results: results.map((result: StoryScanResult) => {
      return {
        ...result,
        inapplicable: undefined,
        passes: undefined,
        testRunner: undefined,
        url: undefined,
        violations: result.violations.map(trimResult),
        incomplete: result.incomplete.map(trimResult),
        timestamp: undefined,
        testEngine: undefined,
        testEnvironment: undefined,
        toolOptions: undefined,
      } as StoryScanResult;
    }),
  };

  const id = new Date().getTime();
  writeFileSync(
    `${__dirname}/htdocs/reports/${id}.json`,
    JSON.stringify(toSave, null),
    "utf8",
  );
  return id;
}
