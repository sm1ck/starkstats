import { HttpsProxyAgent } from "https-proxy-agent";
import { Database } from "../database/Database";
import { iterateContracts } from "./iterateContracts";
import { countTime, sleep } from "../utils/common";

export const hourlyContractsUpdate = async (timeUpdateSec: number, database: Database, proxy: HttpsProxyAgent<string> | boolean, parseUrl: string) => {
    while (true) {
        await iterateContracts(database, false, proxy, parseUrl);
        console.log(`[Wait] -> Задержка ${countTime(timeUpdateSec, true)}до нового обновления контрактов..`);
        await sleep(timeUpdateSec * 1000);
    }
};