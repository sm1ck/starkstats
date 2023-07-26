import fetch from "node-fetch";
import { Database } from "../database/Database";
import Contract, { IContract } from "../database/models/Contract";
import { sleep } from "../utils/common";
import { HttpsProxyAgent } from "https-proxy-agent";
import { randomIntInRange } from "../utils/common";
import mongoose from "mongoose";

export const parseStarkScan: (
  id: string | null,
  minTime: number | null,
  database: Database,
  proxy: HttpsProxyAgent<string> | boolean,
  slowMode: boolean,
  parseUrl: string
) => Promise<void> = async (id, minTime, database, proxy, slowMode, parseUrl) => {
  try {
    let chromeV = randomIntInRange(100, 114);
    // first parse
    let parse = await fetch(parseUrl, {
      method: "POST",
      agent: proxy,
      headers: {
        authority: "api.starkscan.co",
        accept: "application/json",
        "accept-language": "ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7",
        "content-type": "application/json",
        origin: "https://starkscan.co",
        referer: "https://starkscan.co/",
        "sec-ch-ua":
          '"Not.A/Brand";v="8", "Chromium";v="' +
          chromeV +
          '", "Google Chrome";v="' +
          chromeV +
          '"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"macOS"',
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "cross-site",
        "user-agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/" +
          chromeV +
          ".0.0.0 Safari/537.36",
      },
      body: JSON.stringify({
        query:
          "query ContractsTablePaginationFragment(\n  $after: String\n  $first: Int!\n  $input: ContractsInput!\n) {\n  ...ContractsTablePaginationFragment_contracts_2DAjA4\n}\n\nfragment ContractsTablePaginationFragment_contracts_2DAjA4 on Query {\n  contracts(first: $first, after: $after, input: $input) {\n    edges {\n      node {\n        id\n        ...ContractsTableRowFragment_contract\n        __typename\n      }\n      cursor\n    }\n    pageInfo {\n      endCursor\n      hasNextPage\n    }\n  }\n}\n\nfragment ContractsTableRowFragment_contract on Contract {\n  contract_address\n  class_hash\n  contract_identifier\n  implementation_type\n  is_social_verified\n  deployed_at_transaction_hash\n  deployed_at_timestamp\n  starknet_class {\n    type\n    is_code_verified\n    id\n  }\n}\n",
        variables: {
          after: id,
          first: slowMode ? 1 : 1000,
          input: {
            max_deployed_at_timestamp: null,
            min_deployed_at_timestamp: minTime,
            order_by: "desc",
            sort_by: "deployed_at_internal_time",
          },
        },
      }),
    });
    let json: any = await parse.json();
    let contracts = json.data.contracts.edges.reduce((acc: Array<mongoose.HydratedDocument<IContract>>, curr: any) => {
      if (curr.node.implementation_type === "ACCOUNT") {
        acc.push(new Contract({
          contract: curr.node.contract_address,
        }));
      } else {
        console.log(`[Insert] -> ${curr.node.contract_address} имеет тип ${curr.node.implementation_type}, пропускаем..`);
      }
      return acc;
    }, []);
    let endCursor = json.data.contracts.pageInfo.endCursor;
    // push to db
    try {
      await database.writeContracts(contracts);
    } catch (e) {
      if (e.stack.includes("duplicate key")) {
        let successInsert = e?.result?.insertedCount;
        console.log(`[Insert] -> Данные уже есть в таблице, успешно сохранено ${successInsert} контрактов..`);
        if (endCursor === undefined || endCursor === null) {
          return;
        } else {
          return parseStarkScan(endCursor, minTime, database, proxy, slowMode, parseUrl);
        }
      }
    }
    if (endCursor === undefined || endCursor === null) {
      console.log("[Insert] -> Данных для парсинга больше нет..");
      return;
    } else {
      return parseStarkScan(endCursor, minTime, database, proxy, slowMode, parseUrl);
    }
  } catch (e) {
    console.log("[Error] -> ", e);
    await sleep(1000);
    return parseStarkScan(id, minTime, database, proxy, slowMode, parseUrl);
  }
};
