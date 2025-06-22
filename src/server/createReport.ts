import { writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { type Result } from "axe-core";
import { ScanResult } from "src/server/runScan";
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
export function createReport({ results, errors }: ScanResult) {
  const toSave: ScanResult = {
    // @ts-expect-error
    results: results.map((result) => {
      return {
        ...result,
        inapplicable: undefined,
        passes: undefined,
        testRunner: undefined,
        url: undefined,
        violations: result.violations.map(trimResult),
        incomplete: result.incomplete.map(trimResult),
        timestamp: undefined,
      };
    }),
  };

  toSave.errors = errors;

  const id = new Date().getTime();
  writeFileSync(
    `${__dirname}/htdocs/reports/${id}.json`,
    JSON.stringify(toSave, null),
    "utf8",
  );
  return id;
}
