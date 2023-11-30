import { uint256, validateAndParseAddress } from "starknet";
import { ethIdentifier, protocolSelectors, stableIdentifiers18, stableIdentifiers6, } from "../utils/definedConst";
import { formatBalance } from "../utils/common";
import { isParsedCalldataContainsCalls, isParsedCalldataContainsCallArrays, isCall, } from "../json/JSONData";
const parseContractCallData = (calldata) => {
    let checkCall = (call) => {
        let result = {
            token: "",
            amount: 0,
        };
        let shift = 0;
        let to, selector;
        if (isCall(call)) {
            to = [validateAndParseAddress(call.to).toLowerCase()];
            selector = [call.selector];
        }
        else if (isParsedCalldataContainsCallArrays(call.call_array) &&
            call.call_array.length > 0) {
            to = call.call_array.map((v) => validateAndParseAddress(v.to).toLowerCase());
            selector = call.call_array.map((v) => v.selector);
            shift = 3;
        }
        if (to &&
            selector &&
            call.calldata !== undefined &&
            call.calldata.length > 0) {
            for (let protocol of protocolSelectors) {
                if (to.some((v) => protocol.to.includes(v)) &&
                    selector.some((v) => protocol.selector.includes(v))) {
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
                                result.token = validateAndParseAddress(call.calldata[5 + shift]).toLowerCase();
                                if (result.token.includes(ethIdentifier) ||
                                    stableIdentifiers18.some((v) => result.token.includes(v))) {
                                    result.amount = formatBalance(BigInt(amount), 18);
                                }
                                else if (stableIdentifiers6.some((v) => result.token.includes(v))) {
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
                                result.token = validateAndParseAddress(call.calldata[5 + shift]).toLowerCase();
                                if (result.token.includes(ethIdentifier) ||
                                    stableIdentifiers18.some((v) => result.token.includes(v))) {
                                    result.amount = formatBalance(BigInt(amount), 18);
                                }
                                else if (stableIdentifiers6.some((v) => result.token.includes(v))) {
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
                                result.token = validateAndParseAddress(call.calldata[4 + shift]).toLowerCase();
                                if (result.token.includes(ethIdentifier) ||
                                    stableIdentifiers18.some((v) => result.token.includes(v))) {
                                    result.amount = formatBalance(BigInt(amount), 18);
                                }
                                else if (stableIdentifiers6.some((v) => result.token.includes(v))) {
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
                                result.token = validateAndParseAddress(call.calldata[0 + shift]).toLowerCase();
                                if (result.token.includes(ethIdentifier) ||
                                    stableIdentifiers18.some((v) => result.token.includes(v))) {
                                    result.amount = formatBalance(BigInt(amount), 18);
                                }
                                else if (stableIdentifiers6.some((v) => result.token.includes(v))) {
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
                                result.token = validateAndParseAddress(call.calldata[1 + shift]).toLowerCase();
                                if (result.token.includes(ethIdentifier) ||
                                    stableIdentifiers18.some((v) => result.token.includes(v))) {
                                    result.amount = formatBalance(BigInt(amount), 18);
                                }
                                else if (stableIdentifiers6.some((v) => result.token.includes(v))) {
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
                                result.token = validateAndParseAddress(call.calldata[6 + shift]).toLowerCase();
                                if (result.token.includes(ethIdentifier) ||
                                    stableIdentifiers18.some((v) => result.token.includes(v))) {
                                    result.amount = formatBalance(BigInt(amount), 18);
                                }
                                else if (stableIdentifiers6.some((v) => result.token.includes(v))) {
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
                                result.token = validateAndParseAddress(call.calldata[0 + shift]).toLowerCase();
                                if (result.token.includes(ethIdentifier) ||
                                    stableIdentifiers18.some((v) => result.token.includes(v))) {
                                    result.amount = formatBalance(BigInt(amount), 18);
                                }
                                else if (stableIdentifiers6.some((v) => result.token.includes(v))) {
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
                                result.token = validateAndParseAddress(call.calldata[0 + shift]).toLowerCase();
                                if (result.token.includes(ethIdentifier) ||
                                    stableIdentifiers18.some((v) => result.token.includes(v))) {
                                    result.amount = formatBalance(BigInt(amount), 18);
                                }
                                else if (stableIdentifiers6.some((v) => result.token.includes(v))) {
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
        if (isParsedCalldataContainsCalls(calldata.calls) &&
            calldata.calls.length > 0) {
            for (let call of calldata.calls) {
                let result = checkCall(call);
                if (result.amount > 0) {
                    return result;
                }
            }
        }
        else if (isParsedCalldataContainsCallArrays(calldata.call_array) &&
            calldata.call_array.length > 0) {
            let result = checkCall(calldata);
            if (result.amount > 0) {
                return result;
            }
        }
    }
    catch (e) {
        console.log("[Parse Calldata Error] -> ", e);
    }
    return {
        token: "",
        amount: 0,
    };
};
export default parseContractCallData;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFyc2VDb250cmFjdENhbGxEYXRhLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3NlcnZpY2VzL3BhcnNlQ29udHJhY3RDYWxsRGF0YS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsT0FBTyxFQUFFLHVCQUF1QixFQUFFLE1BQU0sVUFBVSxDQUFDO0FBQzVELE9BQU8sRUFDTCxhQUFhLEVBQ2IsaUJBQWlCLEVBQ2pCLG1CQUFtQixFQUNuQixrQkFBa0IsR0FDbkIsTUFBTSx1QkFBdUIsQ0FBQztBQUMvQixPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDaEQsT0FBTyxFQUdMLDZCQUE2QixFQUM3QixrQ0FBa0MsRUFFbEMsTUFBTSxHQUNQLE1BQU0sa0JBQWtCLENBQUM7QUFPMUIsTUFBTSxxQkFBcUIsR0FBRyxDQUFDLFFBQXdCLEVBQUUsRUFBRTtJQUN6RCxJQUFJLFNBQVMsR0FBRyxDQUFDLElBQTJCLEVBQUUsRUFBRTtRQUM5QyxJQUFJLE1BQU0sR0FBVztZQUNuQixLQUFLLEVBQUUsRUFBRTtZQUNULE1BQU0sRUFBRSxDQUFDO1NBQ1YsQ0FBQztRQUNGLElBQUksS0FBSyxHQUFHLENBQUMsQ0FBQztRQUNkLElBQUksRUFBRSxFQUFFLFFBQVEsQ0FBQztRQUNqQixJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsRUFBRTtZQUNoQixFQUFFLEdBQUcsQ0FBQyx1QkFBdUIsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQztZQUN0RCxRQUFRLEdBQUcsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7U0FDNUI7YUFBTSxJQUNMLGtDQUFrQyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUM7WUFDbkQsSUFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUMxQjtZQUNBLEVBQUUsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLEdB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