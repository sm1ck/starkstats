import fetch from "node-fetch";
import { sleep, convertToGraphQlAddress, formatBalance, convertToNormalAddress, } from "../utils/common";
import { bridgeIdentifiers, cexIdentifiers, ethIdentifier, protocolIdentifiers, stableIdentifiers6, stableIdentifiers18, } from "../utils/definedConst";
import parseContractCallData from "./parseContractCallData";
import { isJSONAddress } from "../json/JSONAddress";
import { isJSONError } from "../json/JSONError";
import { isJSONData, } from "../json/JSONData";
const parseSingleContract = async (doc, database, parseUrl, retries) => {
    try {
        let start = performance.now();
        // first parse
        let parse = await fetch(parseUrl, {
            method: "POST",
            headers: {
                accept: "application/json",
                "content-type": "application/json",
            },
            body: JSON.stringify({
                query: `query MyQuery { address(where: {hash: {_eq: "${convertToGraphQlAddress(doc.contract)}"}}) { id } }`,
            }),
        });
        let jsonAddress = (await parse.json());
        // errors
        if (isJSONError(jsonAddress) && jsonAddress.errors.length > 0) {
            console.log("[Error] -> Ошибка при получении адреса:");
            for (let error of jsonAddress.errors) {
                if (error.message) {
                    console.dir(error.message);
                }
                if (error.message.includes("invalid input syntax")) {
                    database.deleteContract(doc);
                    return;
                }
            }
        }
        if (!isJSONAddress(jsonAddress) || jsonAddress.data.address.length <= 0) {
            console.log("[Error] -> JSON не является адресом:");
            console.dir(jsonAddress);
            return;
        }
        let id = jsonAddress.data.address[0].id;
        // by id
        parse = await fetch(parseUrl, {
            method: "POST",
            headers: {
                accept: "application/json",
                "content-type": "application/json",
            },
            body: JSON.stringify({
                query: `query MyQuery { invoke( where: {contract: {id: {_eq: ${id}}}} ) { time parsed_calldata } transfer( where: {_or: [{from_id: {_eq: ${id}}} {to_id: {_eq: ${id}}}]} ) { from { hash } to { hash } token { contract { hash } } amount } deploy(where: {contract: {id: {_eq: ${id}}}}) { time } deploy_account(where: {contract: {id: {_eq: ${id}}}}) { time } token_balance(where: {owner_id: {_eq: ${id}}, token_id: {_eq: 0}}) { balance } }`,
            }),
        });
        let json = (await parse.json());
        // errors
        if (isJSONError(json) && json.errors.length > 0) {
            console.log("[Error] -> Ошибка при получении информации о контракте:");
            for (let error of json.errors) {
                if (error.message) {
                    console.dir(error.message);
                }
            }
        }
        if (!isJSONData(json)) {
            console.log("[Error] -> JSON не является правильным типом данных:");
            console.dir(json);
            return;
        }
        let nonce = +json.data.invoke.length + 1; // 1 -> deploy tx
        let balance = json.data.token_balance.length > 0
            ? formatBalance(BigInt(json.data.token_balance[0].balance), 18)
            : 0;
        if (doc.nonce === undefined || nonce > doc.nonce) {
            doc.nonce = nonce;
        }
        if (doc.balance === undefined || balance > 0) {
            doc.balance = balance;
        }
        let txTimestamps = [];
        txTimestamps = json.data.deploy.reduce((acc, curr) => {
            acc.push(Math.floor(new Date(curr.time).getTime() / 1000));
            return acc;
        }, []);
        if (txTimestamps.length === 0) {
            txTimestamps = json.data.deploy_account.reduce((acc, curr) => {
                acc.push(Math.floor(new Date(curr.time).getTime() / 1000));
                return acc;
            }, []);
        }
        let invokeTimestamps = json.data.invoke.reduce((acc, curr) => {
            acc.push(Math.floor(new Date(curr.time).getTime() / 1000));
            return acc;
        }, []);
        txTimestamps = [...txTimestamps, ...invokeTimestamps];
        let invokeSwapVolumeEth = 0;
        let invokeSwapVolumeStables = 0;
        for (let invoke of json.data.invoke) {
            if (invoke.parsed_calldata !== null) {
                let result = parseContractCallData(invoke.parsed_calldata);
                if (result.token.includes(ethIdentifier)) {
                    invokeSwapVolumeEth += result.amount;
                }
                else if (stableIdentifiers18.some((v) => result.token.includes(v)) ||
                    stableIdentifiers6.some((v) => result.token.includes(v))) {
                    invokeSwapVolumeStables += result.amount;
                }
            }
        }
        let bridgesVolume = json.data.transfer.reduce((total, curr) => {
            if (curr?.from?.hash &&
                curr?.to?.hash &&
                curr?.token?.contract?.hash &&
                convertToNormalAddress(curr.token.contract.hash).includes(ethIdentifier) &&
                bridgeIdentifiers.some((v) => convertToNormalAddress(curr.from.hash).includes(v) ||
                    convertToNormalAddress(curr.to.hash).includes(v))) {
                total += formatBalance(BigInt(curr.amount), 18);
            }
            return total;
        }, 0);
        let bridgesWithCexVolume = json.data.transfer.reduce((total, curr) => {
            if (curr?.from?.hash &&
                curr?.to?.hash &&
                curr?.token?.contract?.hash &&
                convertToNormalAddress(curr.token.contract.hash).includes(ethIdentifier) &&
                (bridgeIdentifiers.some((v) => convertToNormalAddress(curr.from.hash).includes(v) ||
                    convertToNormalAddress(curr.to.hash).includes(v)) ||
                    cexIdentifiers.some((v) => convertToNormalAddress(curr.from.hash).includes(v) ||
                        convertToNormalAddress(curr.to.hash).includes(v)))) {
                total += formatBalance(BigInt(curr.amount), 18);
            }
            return total;
        }, 0);
        let internalVolume = json.data.transfer.reduce((total, curr) => {
            if (curr?.from?.hash &&
                curr?.to?.hash &&
                curr?.token?.contract?.hash &&
                convertToNormalAddress(curr.token.contract.hash).includes(ethIdentifier) &&
                protocolIdentifiers.some((v) => convertToNormalAddress(curr.from.hash).includes(v) ||
                    convertToNormalAddress(curr.to.hash).includes(v))) {
                total += formatBalance(BigInt(curr.amount), 18);
            }
            return total;
        }, 0);
        let internalVolumeStables6 = json.data.transfer.reduce((total, curr) => {
            if (curr?.from?.hash &&
                curr?.to?.hash &&
                curr?.token?.contract?.hash &&
                stableIdentifiers6.some((v) => convertToNormalAddress(curr.token.contract.hash).includes(v)) &&
                protocolIdentifiers.some((v) => convertToNormalAddress(curr.from.hash).includes(v) ||
                    convertToNormalAddress(curr.to.hash).includes(v))) {
                total += formatBalance(BigInt(curr.amount), 6);
            }
            return total;
        }, 0);
        let internalVolumeStables18 = json.data.transfer.reduce((total, curr) => {
            if (curr?.from?.hash &&
                curr?.to?.hash &&
                curr?.token?.contract?.hash &&
                stableIdentifiers18.some((v) => convertToNormalAddress(curr.token.contract.hash).includes(v)) &&
                protocolIdentifiers.some((v) => convertToNormalAddress(curr.from.hash).includes(v) ||
                    convertToNormalAddress(curr.to.hash).includes(v))) {
                total += formatBalance(BigInt(curr.amount), 18);
            }
            return total;
        }, 0);
        let internalVolumeStables = internalVolumeStables6 + internalVolumeStables18;
        internalVolumeStables -= invokeSwapVolumeStables;
        internalVolume -= invokeSwapVolumeEth;
        if (doc.bridgesVolume === undefined || bridgesVolume > doc.bridgesVolume) {
            doc.bridgesVolume = bridgesVolume;
        }
        if (doc.bridgesWithCexVolume === undefined ||
            bridgesWithCexVolume > doc.bridgesWithCexVolume) {
            doc.bridgesWithCexVolume = bridgesWithCexVolume;
        }
        if (doc.txTimestamps === undefined ||
            txTimestamps.length > doc.txTimestamps.length) {
            doc.txTimestamps = txTimestamps;
        }
        if (doc.internalVolume === undefined ||
            internalVolume > doc.internalVolume) {
            doc.internalVolume = internalVolume;
        }
        if (doc.internalVolumeStables === undefined ||
            internalVolumeStables > doc.internalVolumeStables) {
            doc.internalVolumeStables = internalVolumeStables;
        }
        database.updateContract(doc);
        // if (doc.nonce === 0 || doc.txTimestamps.length === 0) {
        //   await database.deleteContract(doc);
        // }
        console.log(`[Update] -> Контракт ${doc.contract} обновлен за ${(performance.now() - start).toFixed(2)} ms`);
        return doc;
    }
    catch (e) {
        console.log("[Update Error] -> ");
        console.dir(e);
        if (retries > 0 && !e?.message?.includes("string longer than")) {
            await sleep(1000);
            return parseSingleContract(doc, database, parseUrl, retries - 1);
        }
    }
};
export default parseSingleContract;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFyc2VTaW5nbGVDb250cmFjdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zZXJ2aWNlcy9wYXJzZVNpbmdsZUNvbnRyYWN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sS0FBSyxNQUFNLFlBQVksQ0FBQztBQUkvQixPQUFPLEVBQ0wsS0FBSyxFQUNMLHVCQUF1QixFQUN2QixhQUFhLEVBQ2Isc0JBQXNCLEdBQ3ZCLE1BQU0saUJBQWlCLENBQUM7QUFDekIsT0FBTyxFQUNMLGlCQUFpQixFQUNqQixjQUFjLEVBQ2QsYUFBYSxFQUNiLG1CQUFtQixFQUNuQixrQkFBa0IsRUFDbEIsbUJBQW1CLEdBQ3BCLE1BQU0sdUJBQXVCLENBQUM7QUFDL0IsT0FBTyxxQkFBcUIsTUFBTSx5QkFBeUIsQ0FBQztBQUM1RCxPQUFPLEVBQXNCLGFBQWEsRUFBRSxNQUFNLHFCQUFxQixDQUFDO0FBQ3hFLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxtQkFBbUIsQ0FBQztBQUNoRCxPQUFPLEVBTUwsVUFBVSxHQUNYLE1BQU0sa0JBQWtCLENBQUM7QUFFMUIsTUFBTSxtQkFBbUIsR0FTckIsS0FBSyxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsUUFBUSxFQUFFLE9BQU8sRUFBRSxFQUFFO0lBQzdDLElBQUk7UUFDRixJQUFJLEtBQUssR0FBRyxXQUFXLENBQUMsR0FBRyxFQUFFLENBQUM7UUFDOUIsY0FBYztRQUNkLElBQUksS0FBSyxHQUFHLE1BQU0sS0FBSyxDQUFDLFFBQVEsRUFBRTtZQUNoQyxNQUFNLEVBQUUsTUFBTTtZQUNkLE9BQU8sRUFBRTtnQkFDUCxNQUFNLEVBQUUsa0JBQWtCO2dCQUMxQixjQUFjLEVBQUUsa0JBQWtCO2FBQ25DO1lBQ0QsSUFBSSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUM7Z0JBQ25CLEtBQUssRUFBRSxnREFBZ0QsdUJBQXVCLENBQzVFLEdBQUcsQ0FBQyxRQUFRLENBQ2IsZUFBZTthQUNq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