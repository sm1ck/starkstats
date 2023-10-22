import Database from "../database/Database";
import iterateContracts from "./iterateContracts";
import parseDeploy from "./parseDeploy";
import { countTime, sleep } from "../utils/common";

const addNewContracts = async (timeUpdateSec: number, database: Database, parseUrl: string) => {
    while (true) {
        // add * 2, fix some bugs
        let time = Math.round(Date.now() / 1000 - timeUpdateSec * 2);
        await parseDeploy(null, time, database, "deploy", false, parseUrl);
        await parseDeploy(null, time, database, "deploy_account", false, parseUrl);
        await iterateContracts(database, true, parseUrl);
        console.log(`[Wait] -> Задержка ${countTime(timeUpdateSec, true)}до нового парсинга..`);
        await sleep(timeUpdateSec * 1000);
    }
};

export default addNewContracts;