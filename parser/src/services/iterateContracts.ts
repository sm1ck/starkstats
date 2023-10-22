import Database from "../database/Database";
import Contract from "../database/models/Contract";
import parseSingleContract from "./parseSingleContract";

const iterateContracts = async (
  database: Database,
  isNew: boolean,
  parseUrl: string
) => {
  let i = 0;
  for await (let doc of isNew
    ? Contract.find({ txTimestamps: { $eq: [] }, nonce: { $eq: 0 } })
    : Contract.find()) {
    try {
      if (doc.contract === undefined) continue;
      console.log(`[Update] -> Контракт #${i}`);
      await parseSingleContract(doc, database, parseUrl, 10);
    } catch (e) {
      console.log("[Error] -> ", e);
    }
    i++;
    //await sleep(200);
  }
};

export default iterateContracts;