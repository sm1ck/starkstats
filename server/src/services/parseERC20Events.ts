import fetch from "node-fetch";
import { HttpsProxyAgent } from "https-proxy-agent";
import { randomIntInRange, sleep } from "../utils/common";

interface BridgeVolume {
    bridgesVolume: number,
    bridgesWithCexVolume: number
}

const cexIdentifiers = ["0x03a20d4f7b4229e7c4863dab158b4d076d7f454b893d90a62011882dc4caca2a"];
const bridgeIdentifiers = ["0x0000000000000000000000000000000000000000000000000000000000000000", "Orbiter Finance", "Layerswap"];

export const parseERC20Events: (
  contract: string,
  token: string,
  proxy: HttpsProxyAgent<string> | boolean,
  parseUrl: string,
  retries: number
) => Promise<BridgeVolume> = async (contract, token, proxy, parseUrl, retries) => {
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
        'query': 'query ERC20TransferEventsTableQuery(\n  $first: Int!\n  $after: String\n  $input: ERC20TransferEventsInput!\n) {\n  ...ERC20TransferEventsTablePaginationFragment_erc20TransferEvents_2DAjA4\n}\n\nfragment ERC20TransferEventsTablePaginationFragment_erc20TransferEvents_2DAjA4 on Query {\n  erc20TransferEvents(first: $first, after: $after, input: $input) {\n    edges {\n      node {\n        id\n        ...ERC20TransferEventsTableRowFragment_erc20TransferEvent\n        __typename\n      }\n      cursor\n    }\n    pageInfo {\n      endCursor\n      hasNextPage\n    }\n  }\n}\n\nfragment ERC20TransferEventsTableRowFragment_erc20TransferEvent on ERC20TransferEvent {\n  id\n  transaction_hash\n  from_address\n  from_erc20_identifier\n  from_contract {\n    is_social_verified\n    id\n  }\n  transfer_from_address\n  transfer_from_identifier\n  transfer_from_contract {\n    is_social_verified\n    id\n  }\n  transfer_to_address\n  transfer_to_identifier\n  transfer_to_contract {\n    is_social_verified\n    id\n  }\n  transfer_amount\n  transfer_amount_display\n  timestamp\n  main_call {\n    selector_identifier\n    id\n  }\n}\n',
        'variables': {
        'first': 1000,
        'after': null,
        'input': {
            'transfer_from_or_to_address': contract,
            'call_invocation_type': 'FUNCTION',
            'sort_by': 'timestamp',
            'order_by': 'desc'
        }
        }
      }),
    });
    let json: any = await parse.json();
    let bridgesVolume: number = json.data.erc20TransferEvents.edges.reduce((total: number, curr: any) => {
        if (curr.node.from_erc20_identifier === token && bridgeIdentifiers.some((v) => String(curr.node.transfer_from_identifier).includes(v))) {
            total += Number(curr.node.transfer_amount_display);
        }
        return total;
    }, 0);
    let bridgesWithCexVolume: number = json.data.erc20TransferEvents.edges.reduce((total: number, curr: any) => {
        if (curr.node.from_erc20_identifier === token && (bridgeIdentifiers.some((v) => String(curr.node.transfer_from_identifier).includes(v)) || cexIdentifiers.some((v) => String(curr.node.transfer_from_identifier).includes(v)))) {
            total += Number(curr.node.transfer_amount_display);
        }
        return total;
    }, 0);
    return {bridgesVolume, bridgesWithCexVolume};
  } catch (e) {
    console.log("[Error] -> ", e);
    if (retries > 0) {
      await sleep(60000);
      return parseERC20Events(contract, token, proxy, parseUrl, retries - 1)
    }
    return {bridgesVolume: 0, bridgesWithCexVolume: 0};
  }
};
