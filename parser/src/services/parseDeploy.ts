import fetch from "node-fetch";
import Database from "../database/Database";
import Contract, { IContract } from "../database/models/Contract";
import { sleep } from "../utils/common";
import { convertToNormalAddress } from "../utils/common";
import { defaultLimit, accountIds } from "../utils/definedConst";
import mongoose from "mongoose";

const parseDeploy: (
  offset: number | null,
  minTime: number | null,
  database: Database,
  table: string,
  slowMode: boolean,
  parseUrl: string
) => Promise<void> = async (offset, minTime, database, table, slowMode, parseUrl) => {
  try {
    let whereTime = minTime ? `, where: {time: {_gte: "${new Date(Math.round(minTime * 1000)).toISOString()}"}}` : "";
    // first parse
    let parse = await fetch(parseUrl, {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        query:
          `query MyQuery { ${table}(limit: ${defaultLimit}, offset: ${offset ?? 0}${whereTime}) { contract { hash, class_id } time } }`,
      }),
    });
    let json: any = await parse.json();
    let contracts = json.data[table].reduce((acc: Array<mongoose.HydratedDocument<IContract>>, curr: any) => {
      if (accountIds.includes(curr.contract.class_id)) {
        acc.push(new Contract({
          contract: convertToNormalAddress(curr.contract.hash),
          nonce: 0,
          balance: 0,
          txTimestamps: [],
          bridgesVolume: 0,
          bridgesWithCexVolume: 0,
          internalVolume: 0,
          internalVolumeStables: 0,

        }));
      } else {
        console.log(`[Insert] -> ${convertToNormalAddress(curr.contract.hash)} имеет class id ${curr.contract.class_id}, пропускаем..`);
      }
      return acc;
    }, []);
    // set offset
    offset = offset ? offset + defaultLimit : defaultLimit;
    // push to db
    try {
      await database.writeContracts(contracts);
    } catch (e) {
      if (e.stack.includes("duplicate key")) {
        let successInsert = e?.result?.insertedCount;
        console.log(`[Insert] -> Данные уже есть в таблице, успешно сохранено ${successInsert} контрактов..`);
        if (contracts.length <= 0) {
          return;
        } else {
          //await sleep(200);
          return parseDeploy(offset, minTime, database, table, slowMode, parseUrl);
        }
      }
    }
    if (contracts.length <= 0) {
      console.log("[Insert] -> Данных для парсинга больше нет..");
      return;
    } else {
      //await sleep(200);
      return parseDeploy(offset, minTime, database, table, slowMode, parseUrl);
    }
  } catch (e) {
    console.log("[Error] -> ", e);
    await sleep(1000);
    return parseDeploy(offset, minTime, database, table, slowMode, parseUrl);
  }
};

export default parseDeploy;