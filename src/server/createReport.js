import { writeFileSync } from "fs";

export function createReport(report)
{
  const toSave = report.map((result) => {
    return {
      ...result,
      inapplicable: undefined,
      passes: undefined,
    }
  })

  writeFileSync(`${__dirname}/htdocs/reports/${new Date().toISOString()}.json`, JSON.stringify(toSave, null, 2), 'utf8');
}