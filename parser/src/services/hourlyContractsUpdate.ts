import iterateContracts from "./iterateContracts";
import { Database, utils } from "shared";

const hourlyContractsUpdate = async (
  timeUpdateSec: number,
  database: Database,
  parseUrl: string,
) => {
  for (;;) {
    await iterateContracts(database, false, parseUrl);
    console.log(
      `[Wait] -> Задержка ${utils.countTime(
        timeUpdateSec,
        true,
      )}до нового обновления контрактов..`,
    );
    await utils.sleep(timeUpdateSec * 1000);
  }
};

export default hourlyContractsUpdate;
