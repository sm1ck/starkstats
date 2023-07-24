import fetch from "node-fetch";
import { HttpsProxyAgent } from "https-proxy-agent";
import { randomIntInRange } from "../utils/common";

export const parseTxHistory: (
  contract: string,
  proxy: HttpsProxyAgent<string> | boolean,
  parseUrl: string
) => Promise<Array<number>> = async (contract, proxy, parseUrl) => {
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
        'query': 'query TransactionsTableQuery(\n  $first: Int!\n  $after: String\n  $input: TransactionsInput!\n) {\n  ...TransactionsTablePaginationFragment_transactions_2DAjA4\n}\n\nfragment TransactionsTableExpandedItemFragment_transaction on Transaction {\n  entry_point_selector_name\n  calldata_decoded\n  entry_point_selector\n  calldata\n  initiator_address\n  initiator_identifier\n  main_calls {\n    selector\n    selector_name\n    calldata_decoded\n    selector_identifier\n    calldata\n    contract_address\n    contract_identifier\n    id\n  }\n}\n\nfragment TransactionsTablePaginationFragment_transactions_2DAjA4 on Query {\n  transactions(first: $first, after: $after, input: $input) {\n    edges {\n      node {\n        id\n        ...TransactionsTableRowFragment_transaction\n        __typename\n      }\n      cursor\n    }\n    pageInfo {\n      endCursor\n      hasNextPage\n    }\n  }\n}\n\nfragment TransactionsTableRowFragment_transaction on Transaction {\n  id\n  transaction_hash\n  block_number\n  transaction_status\n  transaction_type\n  timestamp\n  initiator_address\n  initiator_identifier\n  initiator {\n    is_social_verified\n    id\n  }\n  main_calls {\n    selector_identifier\n    id\n  }\n  ...TransactionsTableExpandedItemFragment_transaction\n}\n',
        'variables': {
          'first': 1000,
          'after': null,
          'input': {
            'initiator_address': contract,
            'sort_by': 'timestamp',
            'order_by': 'desc',
            'min_block_number': null,
            'max_block_number': null,
            'min_timestamp': null,
            'max_timestamp': null
          }
        }
      }),
    });
    let json: any = await parse.json();
    let timestamps: Array<number> = json.data.transactions.edges.map(
      (v: any) => v.node.timestamp
    );
    return timestamps;
  } catch (e) {
    console.log("[Error] -> ", e);
    return [];
  }
};
