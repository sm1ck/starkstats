import { uint256, validateAndParseAddress } from "starknet";
import {
  ethIdentifier,
  protocolSelectors,
  stableIdentifiers18,
  stableIdentifiers6,
} from "../utils/definedConst";
import { formatBalance } from "../utils/common";
import {
  Call,
  ParsedCalldata,
  isParsedCalldataContainsCalls,
  isParsedCalldataContainsCallArrays,
  CallArray,
  isCall,
} from "../json/JSONData";

interface Result {
  token: string;
  amount: number;
}

const parseContractCallData = (calldata: ParsedCalldata) => {
  let checkCall = (call: Call | ParsedCalldata) => {
    let result: Result = {
      token: "",
      amount: 0,
    };
    let shift = 0;
    let to, selector;
    if (isCall(call)) {
      to = [validateAndParseAddress(call.to).toLowerCase()];
      selector = [call.selector];
    } else if (
      isParsedCalldataContainsCallArrays(call.call_array) &&
      call.call_array.length > 0
    ) {
      to = call.call_array.map((v: CallArray) =>
        validateAndParseAddress(v.to).toLowerCase(),
      );
      selector = call.call_array.map((v: CallArray) => v.selector);
      shift = 3;
    }
    if (
      to &&
      selector &&
      call.calldata !== undefined &&
      call.calldata.length > 0
    ) {
      for (let protocol of protocolSelectors) {
        if (
          to.some((v: string) => protocol.to.includes(v)) &&
          selector.some((v: string) => protocol.selector.includes(v))
        ) {
          switch (protocol.name) {
            case "jediswap1":
            case "10kswap1":
            case "10kswap3":
            case "sithswap1":
            case "sithswap3":
              if (call.calldata.length > 8) {
                let amount = uint256.uint256ToBN({
                  low: BigInt(call.calldata[0 + shift]),
                  high: BigInt(call.calldata[1 + shift]),
                });
                result.token = validateAndParseAddress(
                  call.calldata[5 + shift],
                ).toLowerCase();
                if (
                  result.token.includes(ethIdentifier) ||
                  stableIdentifiers18.some((v) => result.token.includes(v))
                ) {
                  result.amount = formatBalance(BigInt(amount), 18);
                } else if (
                  stableIdentifiers6.some((v) => result.token.includes(v))
                ) {
                  result.amount = formatBalance(BigInt(amount), 6);
                }
                return result;
              }
              break;
            case "jediswap2":
            case "10kswap2":
              if (call.calldata.length > 8) {
                let amount = uint256.uint256ToBN({
                  low: BigInt(call.calldata[2 + shift]),
                  high: BigInt(call.calldata[3 + shift]),
                });
                result.token = validateAndParseAddress(
                  call.calldata[5 + shift],
                ).toLowerCase();
                if (
                  result.token.includes(ethIdentifier) ||
                  stableIdentifiers18.some((v) => result.token.includes(v))
                ) {
                  result.amount = formatBalance(BigInt(amount), 18);
                } else if (
                  stableIdentifiers6.some((v) => result.token.includes(v))
                ) {
                  result.amount = formatBalance(BigInt(amount), 6);
                }
                return result;
              }
              break;
            case "sithswap2":
              if (call.calldata.length > 7) {
                let amount = uint256.uint256ToBN({
                  low: BigInt(call.calldata[0 + shift]),
                  high: BigInt(call.calldata[1 + shift]),
                });
                result.token = validateAndParseAddress(
                  call.calldata[4 + shift],
                ).toLowerCase();
                if (
                  result.token.includes(ethIdentifier) ||
                  stableIdentifiers18.some((v) => result.token.includes(v))
                ) {
                  result.amount = formatBalance(BigInt(amount), 18);
                } else if (
                  stableIdentifiers6.some((v) => result.token.includes(v))
                ) {
                  result.amount = formatBalance(BigInt(amount), 6);
                }
                return result;
              }
              break;
            case "avnu":
              if (call.calldata.length > 2) {
                let amount = uint256.uint256ToBN({
                  low: BigInt(call.calldata[1 + shift]),
                  high: BigInt(call.calldata[2 + shift]),
                });
                result.token = validateAndParseAddress(
                  call.calldata[0 + shift],
                ).toLowerCase();
                if (
                  result.token.includes(ethIdentifier) ||
                  stableIdentifiers18.some((v) => result.token.includes(v))
                ) {
                  result.amount = formatBalance(BigInt(amount), 18);
                } else if (
                  stableIdentifiers6.some((v) => result.token.includes(v))
                ) {
                  result.amount = formatBalance(BigInt(amount), 6);
                }
                return result;
              }
              break;
            case "myswap":
              if (call.calldata.length > 5) {
                let amount = uint256.uint256ToBN({
                  low: BigInt(call.calldata[2 + shift]),
                  high: BigInt(call.calldata[3 + shift]),
                });
                result.token = validateAndParseAddress(
                  call.calldata[1 + shift],
                ).toLowerCase();
                if (
                  result.token.includes(ethIdentifier) ||
                  stableIdentifiers18.some((v) => result.token.includes(v))
                ) {
                  result.amount = formatBalance(BigInt(amount), 18);
                } else if (
                  stableIdentifiers6.some((v) => result.token.includes(v))
                ) {
                  result.amount = formatBalance(BigInt(amount), 6);
                }
                return result;
              }
              break;
            case "fibrous1":
              if (call.calldata.length > 12) {
                let len = call.calldata[0 + shift];
                // unimplemented more than one step swaps
                if (parseInt(len, 16) > 1) {
                  return result;
                }
                let amount = uint256.uint256ToBN({
                  low: BigInt(call.calldata[8 + shift]),
                  high: BigInt(call.calldata[9 + shift]),
                });
                result.token = validateAndParseAddress(
                  call.calldata[6 + shift],
                ).toLowerCase();
                if (
                  result.token.includes(ethIdentifier) ||
                  stableIdentifiers18.some((v) => result.token.includes(v))
                ) {
                  result.amount = formatBalance(BigInt(amount), 18);
                } else if (
                  stableIdentifiers6.some((v) => result.token.includes(v))
                ) {
                  result.amount = formatBalance(BigInt(amount), 6);
                }
                return result;
              }
              break;
            case "fibrous2":
              if (call.calldata.length > 13) {
                let amount = uint256.uint256ToBN({
                  low: BigInt(call.calldata[2 + shift]),
                  high: BigInt(call.calldata[3 + shift]),
                });
                result.token = validateAndParseAddress(
                  call.calldata[0 + shift],
                ).toLowerCase();
                if (
                  result.token.includes(ethIdentifier) ||
                  stableIdentifiers18.some((v) => result.token.includes(v))
                ) {
                  result.amount = formatBalance(BigInt(amount), 18);
                } else if (
                  stableIdentifiers6.some((v) => result.token.includes(v))
                ) {
                  result.amount = formatBalance(BigInt(amount), 6);
                }
                return result;
              }
              break;
            case "ekubo":
              if (call.calldata.length > 20) {
                let amount = uint256.uint256ToBN({
                  low: BigInt(call.calldata[1 + shift]),
                  high: BigInt(call.calldata[2 + shift]),
                });
                result.token = validateAndParseAddress(
                  call.calldata[0 + shift],
                ).toLowerCase();
                if (
                  result.token.includes(ethIdentifier) ||
                  stableIdentifiers18.some((v) => result.token.includes(v))
                ) {
                  result.amount = formatBalance(BigInt(amount), 18);
                } else if (
                  stableIdentifiers6.some((v) => result.token.includes(v))
                ) {
                  result.amount = formatBalance(BigInt(amount), 6);
                }
                return result;
              }
              break;
          }
        }
      }
    }
    return result;
  };
  try {
    if (
      isParsedCalldataContainsCalls(calldata.calls) &&
      calldata.calls.length > 0
    ) {
      for (let call of calldata.calls) {
        let result = checkCall(call);
        if (result.amount > 0) {
          return result;
        }
      }
    } else if (
      isParsedCalldataContainsCallArrays(calldata.call_array) &&
      calldata.call_array.length > 0
    ) {
      let result = checkCall(calldata);
      if (result.amount > 0) {
        return result;
      }
    }
  } catch (e) {
    console.log("[Parse Calldata Error] -> ", e);
  }
  return {
    token: "",
    amount: 0,
  };
};

export default parseContractCallData;
