import { writeFileSync } from "fs";
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export function createReport(report)
{
  const toSave = report.map((result) => {
    return {
      ...result,
      inapplicable: undefined,
      passes: undefined,
    }
  })

  const id = new Date().getTime()
  writeFileSync(`${__dirname}/htdocs/reports/${id}.json`, JSON.stringify(toSave, null, 2), 'utf8');
  return id
}