/* eslint-disable @typescript-eslint/no-explicit-any */
import { uint256, validateAndParseAddress } from "starknet";
import { ethIdentifier, protocolSelectors, stableIdentifiers18, stableIdentifiers6, } from "../utils/definedConst";
import { formatBalance } from "../utils/common";
const parseContractCallData = (calldata) => {
    let checkCall = (call) => {
        let result = {
            token: "",
            amount: 0,
        };
        let shift = 0;
        let to, selector;
        if (call?.to && call?.selector) {
            to = [validateAndParseAddress(call.to).toLowerCase()];
            selector = [call.selector];
        }
        else if (call?.call_array?.length > 0) {
            to = call.call_array.map((v) => validateAndParseAddress(v.to).toLowerCase());
            selector = call.call_array.map((v) => v.selector);
            shift = 3;
        }
        if (to && selector && call?.calldata?.length > 0) {
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
                    }
                }
            }
        }
        return result;
    };
    try {
        if (calldata?.calls?.length > 0) {
            for (let call of calldata.calls) {
                let result = checkCall(call);
                if (result.amount > 0) {
                    return result;
                }
            }
        }
        else if (calldata?.call_array?.length > 0) {
            let result = checkCall(calldata);
            if (result.amount > 0) {
                return result;
            }
        }
    }
    catch (e) {
        console.log("[Parse calldata error] -> ", e);
    }
    return {
        token: "",
        amount: 0,
    };
};
export default parseContractCallData;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFyc2VDb250cmFjdENhbGxEYXRhLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3NlcnZpY2VzL3BhcnNlQ29udHJhY3RDYWxsRGF0YS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSx1REFBdUQ7QUFDdkQsT0FBTyxFQUFFLE9BQU8sRUFBRSx1QkFBdUIsRUFBRSxNQUFNLFVBQVUsQ0FBQztBQUM1RCxPQUFPLEVBQ0wsYUFBYSxFQUNiLGlCQUFpQixFQUNqQixtQkFBbUIsRUFDbkIsa0JBQWtCLEdBQ25CLE1BQU0sdUJBQXVCLENBQUM7QUFDL0IsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBT2hELE1BQU0scUJBQXFCLEdBQUcsQ0FBQyxRQUFhLEVBQUUsRUFBRTtJQUM5QyxJQUFJLFNBQVMsR0FBRyxDQUFDLElBQVMsRUFBRSxFQUFFO1FBQzVCLElBQUksTUFBTSxHQUFXO1lBQ25CLEtBQUssRUFBRSxFQUFFO1lBQ1QsTUFBTSxFQUFFLENBQUM7U0FDVixDQUFDO1FBQ0YsSUFBSSxLQUFLLEdBQUcsQ0FBQyxDQUFDO1FBQ2QsSUFBSSxFQUFFLEVBQUUsUUFBUSxDQUFDO1FBQ2pCLElBQUksSUFBSSxFQUFFLEVBQUUsSUFBSSxJQUFJLEVBQUUsUUFBUSxFQUFFO1lBQzlCLEVBQUUsR0FBRyxDQUFDLHVCQUF1QixDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDO1lBQ3RELFFBQVEsR0FBRyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztTQUM1QjthQUFNLElBQUksSUFBSSxFQUFFLFVBQVUsRUFBRSxNQUFNLEdBQUcsQ0FBQyxFQUFFO1lBQ3ZDLEVBQUUsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQU0sRUFBRSxFQUFFLENBQ2xDLHVCQUF1QixDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FDNUMsQ0FBQztZQUNGLFFBQVEsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQU0sRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQ3ZELEtBQUssR0FBRyxDQUFDLENBQUM7U0FDWDtRQUNELElBQUksRUFBRSxJQUFJLFFBQVEsSUFBSSxJQUFJLEVBQUUsUUFBUSxFQUFFLE1BQU0sR0FBRyxDQUFDLEVBQUU7WUFDaEQsS0FBSyxJQUFJLFFBQVEsSUFBSSxpQkFBaUIsRUFBRTtnQkFDdEMsSUFDRSxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBTSxFQUFFLEVBQUUsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDNUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQU0sRUFBRSxFQUFFLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFDeEQ7b0JBQ0EsUUFBUSxRQUFRLENBQUMsSUFBSSxFQUFFO3dCQUNyQixLQUFLLFdBQVcsQ0FBQzt3QkFDakIsS0FBSyxVQUFVLENBQUM7d0JBQ2hCLEtBQUssVUFBVSxDQUFDO3dCQUNoQixLQUFLLFdBQVcsQ0FBQzt3QkFDakIsS0FBSyxXQUFXOzRCQUNkLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO2dDQUM1QixJQUFJLE1BQU0sR0FBRyxPQUFPLENBQUMsV0FBVyxDQUFDO29DQUMvQixHQUFHLEVBQUUsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxDQUFDO29DQUNyQyxJQUFJLEVBQUUsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxDQUFDO2lDQUN2QyxDQUFDLENBQUM7Z0NBQ0gsTUFBTSxDQUFDLEtBQUssR0FBRyx1QkFBdUIsQ0FDcEMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLENBQ3pCLENBQUMsV0FBVyxFQUFFLENBQUM7Z0NBQ2hCLElBQ0UsTUFBTSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUFDO29DQUNwQyxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQ3pEO29DQUNBLE1BQU0sQ0FBQyxNQUFNLEdBQUcsYUFBYSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztpQ0FDbkQ7cUNBQU0sSUFDTCxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQ3hEO29DQUNBLE1BQU0sQ0FBQyxNQUFNLEdBQUcsYUFBYSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztpQ0FDbEQ7Z0NBQ0QsT0FBTyxNQUFNLENBQUM7NkJBQ2Y7NEJBQ0QsTUFBTTt3QkFDUixLQUFLLFdBQVcsQ0FBQzt3QkFDakIsS0FBSyxVQUFVOzRCQUNiLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO2dDQUM1QixJQUFJLE1BQU0sR0FBRyxPQUFPLENBQUMsV0FBVyxDQUFDO29DQUMvQixHQUFHLEVBQUUsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxDQUFDO29DQUNyQyxJQUFJLEVBQUUsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxDQUFDO2lDQUN2QyxDQUFDLENBQUM7Z0NBQ0gsTUFBTSxDQUFDLEtBQUssR0FBRyx1QkFBdUIsQ0FDcEMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLENBQ3pCLENBQUMsV0FBVyxFQUFFLENBQUM7Z0NBQ2hCLElBQ0UsTUFBTSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUFDO29DQUNwQyxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQ3pEO29DQUNBLE1BQU0sQ0FBQyxNQUFNLEdBQUcsYUFBYSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztpQ0FDbkQ7cUNBQU0sSUFDTCxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQ3hEO29DQUNBLE1BQU0sQ0FBQyxNQUFNLEdBQUcsYUFBYSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztpQ0FDbEQ7Z0NBQ0QsT0FBTyxNQUFNLENBQUM7NkJBQ2Y7NEJBQ0QsTUFBTTt3QkFDUixLQUFLLFdBQVc7NEJBQ2QsSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7Z0NBQzVCLElBQUksTUFBTSxHQUFHLE9BQU8sQ0FBQyxXQUFXLENBQUM7b0NBQy9CLEdBQUcsRUFBRSxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLENBQUM7b0NBQ3JDLElBQUksRUFBRSxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLENBQUM7aUNBQ3ZDLENBQUMsQ0FBQztnQ0FDSCxNQUFNLENBQUMsS0FBSyxHQUFHLHVCQUF1QixDQUNwQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FDekIsQ0FBQyxXQUFXLEVBQUUsQ0FBQztnQ0FDaEIsSUFDRSxNQUFNLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUM7b0NBQ3BDLG1CQUFtQixDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFDekQ7b0NBQ0EsTUFBTSxDQUFDLE1BQU0sR0FBRyxhQUFhLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO2lDQUNuRDtxQ0FBTSxJQUNMLGtCQUFrQixDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFDeEQ7b0NBQ0EsTUFBTSxDQUFDLE1BQU0sR0FBRyxhQUFhLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO2lDQUNsRDtnQ0FDRCxPQUFPLE1BQU0sQ0FBQzs2QkFDZjs0QkFDRCxNQUFNO3dCQUNSLEtBQUssTUFBTTs0QkFDVCxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtnQ0FDNUIsSUFBSSxNQUFNLEdBQUcsT0FBTyxDQUFDLFdBQVcsQ0FBQztvQ0FDL0IsR0FBRyxFQUFFLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQztvQ0FDckMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQztpQ0FDdkMsQ0FBQyxDQUFDO2dDQUNILE1BQU0sQ0FBQyxLQUFLLEdBQUcsdUJBQXVCLENBQ3BDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxDQUN6QixDQUFDLFdBQVcsRUFBRSxDQUFDO2dDQUNoQixJQUNFLE1BQU0sQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQztvQ0FDcEMsbUJBQW1CLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUN6RDtvQ0FDQSxNQUFNLENBQUMsTUFBTSxHQUFHLGFBQWEsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7aUNBQ25EO3FDQUFNLElBQ0wsa0JBQWtCLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUN4RDtvQ0FDQSxNQUFNLENBQUMsTUFBTSxHQUFHLGFBQWEsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7aUNBQ2xEO2dDQUNELE9BQU8sTUFBTSxDQUFDOzZCQUNmOzRCQUNELE1BQU07d0JBQ1IsS0FBSyxRQUFROzRCQUNYLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO2dDQUM1QixJQUFJLE1BQU0sR0FBRyxPQUFPLENBQUMsV0FBVyxDQUFDO29DQUMvQixHQUFHLEVBQUUsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxDQUFDO29DQUNyQyxJQUFJLEVBQUUsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxDQUFDO2lDQUN2QyxDQUFDLENBQUM7Z0NBQ0gsTUFBTSxDQUFDLEtBQUssR0FBRyx1QkFBdUIsQ0FDcEMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLENBQ3pCLENBQUMsV0FBVyxFQUFFLENBQUM7Z0NBQ2hCLElBQ0UsTUFBTSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUFDO29DQUNwQyxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQ3pEO29DQUNBLE1BQU0sQ0FBQyxNQUFNLEdBQUcsYUFBYSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztpQ0FDbkQ7cUNBQU0sSUFDTCxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQ3hEO29DQUNBLE1BQU0sQ0FBQyxNQUFNLEdBQUcsYUFBYSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztpQ0FDbEQ7Z0NBQ0QsT0FBTyxNQUFNLENBQUM7NkJBQ2Y7NEJBQ0QsTUFBTTt3QkFDUixLQUFLLFVBQVU7NEJBQ2IsSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sR0FBRyxFQUFFLEVBQUU7Z0NBQzdCLElBQUksR0FBRyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxDQUFDO2dDQUNuQyx5Q0FBeUM7Z0NBQ3pDLElBQUksUUFBUSxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUU7b0NBQ3pCLE9BQU8sTUFBTSxDQUFDO2lDQUNmO2dDQUNELElBQUksTUFBTSxHQUFHLE9BQU8sQ0FBQyxXQUFXLENBQUM7b0NBQy9CLEdBQUcsRUFBRSxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLENBQUM7b0NBQ3JDLElBQUksRUFBRSxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLENBQUM7aUNBQ3ZDLENBQUMsQ0FBQztnQ0FDSCxNQUFNLENBQUMsS0FBSyxHQUFHLHVCQUF1QixDQUNwQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FDekIsQ0FBQyxXQUFXLEVBQUUsQ0FBQztnQ0FDaEIsSUFDRSxNQUFNLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUM7b0NBQ3BDLG1CQUFtQixDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFDekQ7b0NBQ0EsTUFBTSxDQUFDLE1BQU0sR0FBRyxhQUFhLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO2lDQUNuRDtxQ0FBTSxJQUNMLGtCQUFrQixDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFDeEQ7b0NBQ0EsTUFBTSxDQUFDLE1BQU0sR0FBRyxhQUFhLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO2lDQUNsRDtnQ0FDRCxPQUFPLE1BQU0sQ0FBQzs2QkFDZjs0QkFDRCxNQUFNO3dCQUNSLEtBQUssVUFBVTs0QkFDYixJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxHQUFHLEVBQUUsRUFBRTtnQ0FDN0IsSUFBSSxNQUFNLEdBQUcsT0FBTyxDQUFDLFdBQVcsQ0FBQztvQ0FDL0IsR0FBRyxFQUFFLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQztvQ0FDckMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQztpQ0FDdkMsQ0FBQyxDQUFDO2dDQUNILE1BQU0sQ0FBQyxLQUFLLEdBQUcsdUJBQXVCLENBQ3BDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxDQUN6QixDQUFDLFdBQVcsRUFBRSxDQUFDO2dDQUNoQixJQUNFLE1BQU0sQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQztvQ0FDcEMsbUJBQW1CLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUN6RDtvQ0FDQSxNQUFNLENBQUMsTUFBTSxHQUFHLGFBQWEsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7aUNBQ25EO3FDQUFNLElBQ0wsa0JBQWtCLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUN4RDtvQ0FDQSxNQUFNLENBQUMsTUFBTSxHQUFHLGFBQWEsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7aUNBQ2xEO2dDQUNELE9BQU8sTUFBTSxDQUFDOzZCQUNmOzRCQUNELE1BQU07cUJBQ1Q7aUJBQ0Y7YUFDRjtTQUNGO1FBQ0QsT0FBTyxNQUFNLENBQUM7SUFDaEIsQ0FBQyxDQUFDO0lBQ0YsSUFBSTtRQUNGLElBQUksUUFBUSxFQUFFLEtBQUssRUFBRSxNQUFNLEdBQUcsQ0FBQyxFQUFFO1lBQy9CLEtBQUssSUFBSSxJQUFJLElBQUksUUFBUSxDQUFDLEtBQUssRUFBRTtnQkFDL0IsSUFBSSxNQUFNLEdBQUcsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUM3QixJQUFJLE1BQU0sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO29CQUNyQixPQUFPLE1BQU0sQ0FBQztpQkFDZjthQUNGO1NBQ0Y7YUFBTSxJQUFJLFFBQVEsRUFBRSxVQUFVLEVBQUUsTUFBTSxHQUFHLENBQUMsRUFBRTtZQUMzQyxJQUFJLE1BQU0sR0FBRyxTQUFTLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDakMsSUFBSSxNQUFNLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtnQkFDckIsT0FBTyxNQUFNLENBQUM7YUFDZjtTQUNGO0tBQ0Y7SUFBQyxPQUFPLENBQUMsRUFBRTtRQUNWLE9BQU8sQ0FBQyxHQUFHLENBQUMsNEJBQTRCLEVBQUUsQ0FBQyxDQUFDLENBQUM7S0FDOUM7SUFDRCxPQUFPO1FBQ0wsS0FBSyxFQUFFLEVBQUU7UUFDVCxNQUFNLEVBQUUsQ0FBQztLQUNWLENBQUM7QUFDSixDQUFDLENBQUM7QUFFRixlQUFlLHFCQUFxQixDQUFDIn0=