import iterateContracts from "./iterateContracts";
import parseDeploy from "./parseDeploy";
import { Database, utils } from "shared";

const addNewContracts = async (
  timeUpdateSec: number,
  database: Database,
  parseUrl: string,
) => {
  for (;;) {
    // add * 2, fix some bugs
    let time = Math.round(Date.now() / 1000 - timeUpdateSec * 2);
    await parseDeploy(null, time, database, "deploy", false, parseUrl);
    await parseDeploy(null, time, database, "deploy_account", false, parseUrl);
    await iterateContracts(database, true, parseUrl);
    console.log(
      `[Wait] -> Задержка ${utils.countTime(
        timeUpdateSec,
        true,
      )}до нового парсинга..`,
    );
    await utils.sleep(timeUpdateSec * 1000);
  }
};

export default addNewContracts;
