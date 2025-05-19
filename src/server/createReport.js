import { writeFileSync } from "fs";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { timeStamp } from "console";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function trimResult(result)
{
  return {
    ...result,
    description: undefined,
    help: undefined,
    helpUrl: undefined,
    nodes: undefined,
  }
}
export function createReport(report)
{
  const toSave = report.map((result) => {
    return {
      ...result,
      inapplicable: undefined,
      passes: undefined,
      testEngine: undefined,
      testEnvironment: undefined,
      toolOptions: undefined,
      testRunner: undefined,
      url:undefined,
      violations: result.violations.map(trimResult),
      incomplete: result.incomplete.map(trimResult),
      timestamp: undefined
    }
  })

  const id = new Date().getTime()
  writeFileSync(`${__dirname}/htdocs/reports/${id}.json`, JSON.stringify(toSave, null), 'utf8');
  return id
}