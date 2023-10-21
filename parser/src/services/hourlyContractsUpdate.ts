import Database from "../database/Database";
import iterateContracts from "./iterateContracts";
import { countTime, sleep } from "../utils/common";

const hourlyContractsUpdate = async (timeUpdateSec: number, database: Database, parseUrl: string, hasuraSecret: string) => {
    while (true) {
        await iterateContracts(database, false, parseUrl, hasuraSecret);
        console.log(`[Wait] -> Задержка ${countTime(timeUpdateSec, true)}до нового обновления контрактов..`);
        await sleep(timeUpdateSec * 1000);
    }
};

export default hourlyContractsUpdate;