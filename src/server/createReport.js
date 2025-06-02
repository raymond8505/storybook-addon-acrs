import { writeFileSync } from "fs";
import { fileURLToPath } from 'url';
import { dirname } from 'path';

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
export function createReport({results,errors})
{
  const toSave = {results: results.map((result) => {
    return {
      ...result,
      inapplicable: undefined,
      passes: undefined,
      testRunner: undefined,  
      url:undefined,
      violations: result.violations.map(trimResult),
      incomplete: result.incomplete.map(trimResult),
      timestamp: undefined
    }
  })}

  toSave.errors = errors

  const id = new Date().getTime()
  writeFileSync(`${__dirname}/htdocs/reports/${id}.json`, JSON.stringify(toSave, null), 'utf8');
  return id
}