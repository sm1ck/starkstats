import { HttpsProxyAgent } from "https-proxy-agent";
import { Database } from "../database/Database";
import Contract from "../database/models/Contract";
import { sleep } from "../utils/common";
import { parseSingleContract } from "./parseSingleContract";

export const iterateContracts = async (
  database: Database,
  isNew: boolean,
  proxy: HttpsProxyAgent<string> | boolean,
  parseUrl: string
) => {
  let i = 0;
  for await (const doc of isNew
    ? Contract.find({ txTimestamps: { $eq: [] } })
    : Contract.find()) {
    try {
      if (doc.contract === undefined) continue;
      console.log(`[Update] -> Контракт #${i}`);
      parseSingleContract(doc, database, proxy, parseUrl, 10);
    } catch (e) {
      console.log("[Error] -> ", e);
    }
    i++;
    await sleep(20);
  }
};
