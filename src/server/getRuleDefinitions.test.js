import { describe } from "node:test";
import { getRuleDefinitions } from "./getRuleDefinitions";

describe('getRuleDefinitions', () => {
  it('works', async () => {
    console.log(await getRuleDefinitions())
  })
})