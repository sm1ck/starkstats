import fetch from "node-fetch";
import mongoose from "mongoose";
import { Database } from "../database/Database";
import { IContract } from "../database/models/Contract";
import { HttpsProxyAgent } from "https-proxy-agent";
import { randomIntInRange } from "../utils/common";
import { parseTxHistory } from "./parseTxHistory";

export const parseSingleContract: (
  doc: mongoose.HydratedDocument<IContract>,
  database: Database,
  proxy: HttpsProxyAgent<string> | boolean,
  parseUrl: string
) => Promise<void> = async (doc, database, proxy, parseUrl) => {
  try {
    let chromeV = randomIntInRange(100, 114);
    // first parse
    let parse = await fetch(parseUrl, {
      method: "POST",
      agent: proxy,
      headers: {
        authority: "starkscan.stellate.sh",
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
          "query ContractPageQuery(\n  $input: ContractInput!\n) {\n  contract(input: $input) {\n    contract_address\n    is_starknet_class_code_verified\n    implementation_type\n    ...ContractPageContainerFragment_contract\n    ...ContractPageOverviewTabFragment_contract\n    ...ContractPageClassCodeHistoryTabFragment_contract\n    ...ContractFunctionReadWriteTabFragment_contract\n    id\n  }\n}\n\nfragment ContractFunctionReadCallsFragment_starknetClass on StarknetClass {\n  is_code_verified\n  abi_final\n}\n\nfragment ContractFunctionReadWriteTabFragment_contract on Contract {\n  contract_address\n  starknet_class {\n    ...ContractFunctionReadCallsFragment_starknetClass\n    ...ContractFunctionWriteCallsFragment_starknetClass\n    id\n  }\n}\n\nfragment ContractFunctionWriteCallsFragment_starknetClass on StarknetClass {\n  is_code_verified\n  abi_final\n}\n\nfragment ContractPageClassCodeHistoryTabFragment_contract on Contract {\n  contract_address\n  starknet_class {\n    is_code_verified\n    id\n  }\n  ...ContractPageCodeSubTabFragment_contract\n}\n\nfragment ContractPageCodeSubTabFragment_contract on Contract {\n  starknet_class {\n    class_hash\n    ...StarknetClassCodeTabFragment_starknetClass\n    id\n  }\n}\n\nfragment ContractPageContainerFragment_contract on Contract {\n  contract_address\n  implementation_type\n  is_starknet_class_code_verified\n  contract_stats {\n    number_of_transactions\n    number_of_account_calls\n    number_of_events\n    id\n  }\n}\n\nfragment ContractPageOverviewTabClassHashPlacedAtItemFragment_contract on Contract {\n  deployed_at_transaction_hash\n  class_hash_placed_at_transaction_hash\n  class_hash_placed_at_timestamp\n}\n\nfragment ContractPageOverviewTabEthBalanceItemFragment_contract on Contract {\n  eth_balance {\n    balance_display\n    id\n  }\n}\n\nfragment ContractPageOverviewTabFragment_contract on Contract {\n  contract_address\n  class_hash\n  name_tag\n  is_social_verified\n  deployed_by_contract_address\n  deployed_by_contract_identifier\n  deployed_at_transaction_hash\n  deployed_at_timestamp\n  ...ContractPageOverviewTabEthBalanceItemFragment_contract\n  ...ContractPageOverviewTabTypeItemFragment_contract\n  ...ContractPageOverviewTabStarknetIDItemFragment_contract\n  starknet_class {\n    ...StarknetClassVersionItemFragment_starknetClass\n    id\n  }\n  ...ContractPageOverviewTabClassHashPlacedAtItemFragment_contract\n}\n\nfragment ContractPageOverviewTabStarknetIDItemFragment_contract on Contract {\n  starknet_id {\n    domain\n  }\n}\n\nfragment ContractPageOverviewTabTypeItemFragment_contract on Contract {\n  implementation_type\n  starknet_class {\n    type\n    id\n  }\n}\n\nfragment StarknetClassCodeTabAbiAndByteCodeItemFragment_starknetClass on StarknetClass {\n  is_code_verified\n  abi_final\n  bytecode\n  sierra_program\n}\n\nfragment StarknetClassCodeTabFragment_starknetClass on StarknetClass {\n  ...StarknetClassCodeTabVerifiedItemFragment_starknetClass\n  ...StarknetClassCodeTabSourceCodeItemFragment_starknetClass\n  ...StarknetClassCodeTabAbiAndByteCodeItemFragment_starknetClass\n}\n\nfragment StarknetClassCodeTabSourceCodeItemFragment_starknetClass on StarknetClass {\n  class_hash\n  verified {\n    source_code\n  }\n}\n\nfragment StarknetClassCodeTabVerifiedItemFragment_starknetClass on StarknetClass {\n  is_code_verified\n  verified {\n    name\n    source_code\n    verified_at_timestamp\n  }\n}\n\nfragment StarknetClassVersionItemFragment_starknetClass on StarknetClass {\n  is_cairo_one\n}\n",
        variables: {
          input: {
            contract_address: doc.contract,
          },
        },
      }),
    });
    let json: any = await parse.json();
    let nonce = json.data.contract.contract_stats.number_of_transactions;
    let balance = Number(json.data.contract.eth_balance.balance_display);
    // push to db
    doc.nonce = nonce;
    doc.balance = balance;
    let txTimestamps = await parseTxHistory(doc.contract, proxy, parseUrl);
    if (txTimestamps.length > doc.txTimestamps.length) {
      doc.txTimestamps = txTimestamps;
    }
    await database.updateContract(doc);
    // if (doc.nonce === 0 || doc.txTimestamps.length === 0) {
    //   await database.deleteContract(doc);
    // }
  } catch (e) {
    console.log("[Error] -> ", e);
  }
};
