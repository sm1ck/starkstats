import { uint256, getChecksumAddress } from "starknet";
import { ethIdentifier, protocolSelectors, stableIdentifiers18, stableIdentifiers6 } from "../utils/definedConst";
import { formatBalance } from "../utils/common";

interface Result {
    token: string,
    amount: number,
}

const parseContractCallData = (calldata: any) => {
    let result: Result = {
        token: "",
        amount: 0,
    }
    try {
        if (calldata?.calls?.length > 0) {
            for (let call of calldata.calls) {
                if (call?.to && call?.selector && call?.calldata?.length > 0) {
                    for (let protocol of protocolSelectors) {
                        let to = getChecksumAddress(call.to).toLowerCase();
                        if (to.includes(protocol.to) && call.selector.includes(protocol.selector)) {
                            switch (protocol.name) {
                                case "jediswap1":
                                case "10kswap1":
                                case "10kswap3":
                                case "sithswap1":
                                case "sithswap3":
                                    if (call.calldata.length > 8) {
                                        let amount = uint256.uint256ToBN({ low: BigInt(call.calldata[0]), high: BigInt(call.calldata[1])});
                                        result.token = getChecksumAddress(call.calldata[5]).toLowerCase();
                                        if (result.token.includes(ethIdentifier) || stableIdentifiers18.some((v) => result.token.includes(v))) {
                                            result.amount = formatBalance(BigInt(amount), 18);
                                        } else if (stableIdentifiers6.some((v) => result.token.includes(v))) {
                                            result.amount = formatBalance(BigInt(amount), 6);
                                        }
                                        return result;
                                    }
                                    break;
                                case "jediswap2":
                                case "10kswap2":
                                    if (call.calldata.length > 8) {
                                        let amount = uint256.uint256ToBN({ low: BigInt(call.calldata[2]), high: BigInt(call.calldata[3])});
                                        result.token = getChecksumAddress(call.calldata[5]).toLowerCase();
                                        if (result.token.includes(ethIdentifier) || stableIdentifiers18.some((v) => result.token.includes(v))) {
                                            result.amount = formatBalance(BigInt(amount), 18);
                                        } else if (stableIdentifiers6.some((v) => result.token.includes(v))) {
                                            result.amount = formatBalance(BigInt(amount), 6);
                                        }
                                        return result;
                                    }
                                    break;
                                case "sithswap2":
                                    if (call.calldata.length > 7) {
                                        let amount = uint256.uint256ToBN({ low: BigInt(call.calldata[0]), high: BigInt(call.calldata[1])});
                                        result.token = getChecksumAddress(call.calldata[4]).toLowerCase();
                                        if (result.token.includes(ethIdentifier) || stableIdentifiers18.some((v) => result.token.includes(v))) {
                                            result.amount = formatBalance(BigInt(amount), 18);
                                        } else if (stableIdentifiers6.some((v) => result.token.includes(v))) {
                                            result.amount = formatBalance(BigInt(amount), 6);
                                        }
                                        return result;
                                    }
                                    break;
                                case "avnu":
                                    if (call.calldata.length > 2) {
                                        let amount = uint256.uint256ToBN({ low: BigInt(call.calldata[1]), high: BigInt(call.calldata[2])});
                                        result.token = getChecksumAddress(call.calldata[0]).toLowerCase();
                                        if (result.token.includes(ethIdentifier) || stableIdentifiers18.some((v) => result.token.includes(v))) {
                                            result.amount = formatBalance(BigInt(amount), 18);
                                        } else if (stableIdentifiers6.some((v) => result.token.includes(v))) {
                                            result.amount = formatBalance(BigInt(amount), 6);
                                        }
                                        return result;
                                    }
                                    break;
                                case "myswap":
                                    if (call.calldata.length > 5) {
                                        let amount = uint256.uint256ToBN({ low: BigInt(call.calldata[2]), high: BigInt(call.calldata[3])});
                                        result.token = getChecksumAddress(call.calldata[1]).toLowerCase();
                                        if (result.token.includes(ethIdentifier) || stableIdentifiers18.some((v) => result.token.includes(v))) {
                                            result.amount = formatBalance(BigInt(amount), 18);
                                        } else if (stableIdentifiers6.some((v) => result.token.includes(v))) {
                                            result.amount = formatBalance(BigInt(amount), 6);
                                        }
                                        return result;
                                    }
                                    break;
                                case "fibrous1":
                                    if (call.calldata.length > 12) {
                                        let amount = uint256.uint256ToBN({ low: BigInt(call.calldata[8]), high: BigInt(call.calldata[9])});
                                        result.token = getChecksumAddress(call.calldata[6]).toLowerCase();
                                        if (result.token.includes(ethIdentifier) || stableIdentifiers18.some((v) => result.token.includes(v))) {
                                            result.amount = formatBalance(BigInt(amount), 18);
                                        } else if (stableIdentifiers6.some((v) => result.token.includes(v))) {
                                            result.amount = formatBalance(BigInt(amount), 6);
                                        }
                                        return result;
                                    }
                                    break;
                                case "fibrous2":
                                    if (call.calldata.length > 13) {
                                        let amount = uint256.uint256ToBN({ low: BigInt(call.calldata[2]), high: BigInt(call.calldata[3])});
                                        result.token = getChecksumAddress(call.calldata[0]).toLowerCase();
                                        if (result.token.includes(ethIdentifier) || stableIdentifiers18.some((v) => result.token.includes(v))) {
                                            result.amount = formatBalance(BigInt(amount), 18);
                                        } else if (stableIdentifiers6.some((v) => result.token.includes(v))) {
                                            result.amount = formatBalance(BigInt(amount), 6);
                                        }
                                        return result;
                                    }
                                    break;
                            }
                        }
                    }
                }
            }
        }
    } catch (e) {
        console.log("[Parse calldata error] -> ", e)
    }
    return result;
};

export default parseContractCallData;