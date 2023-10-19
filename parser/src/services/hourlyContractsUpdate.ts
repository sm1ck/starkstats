import Database from "../database/Database";
import iterateContracts from "./iterateContracts";
import { countTime, sleep } from "../utils/common";

const hourlyContractsUpdate = async (timeUpdateSec: number, database: Database, parseUrl: string) => {
    while (true) {
        await iterateContracts(database, false, parseUrl);
        console.log(`[Wait] -> Задержка ${countTime(timeUpdateSec, true)}до нового обновления контрактов..`);
        await sleep(timeUpdateSec * 1000);
    }
};

export default hourlyContractsUpdate;