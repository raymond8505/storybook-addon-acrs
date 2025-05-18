import { describe } from "node:test";
import { runScan } from "./runScan";
import { createReport } from "./createReport";

describe('createReport', () => {
  const testIds = [
        'example-button--primary',
  ]
  it('writes a report to a file', async () => {
    const report = await runScan({stories: testIds})
    createReport(report)
  })
})