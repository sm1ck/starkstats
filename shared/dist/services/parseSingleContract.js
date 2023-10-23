/* eslint-disable @typescript-eslint/no-explicit-any */
import fetch from "node-fetch";
import { sleep, convertToGraphQlAddress, formatBalance, convertToNormalAddress, } from "../utils/common";
import { bridgeIdentifiers, cexIdentifiers, ethIdentifier, protocolIdentifiers, stableIdentifiers6, stableIdentifiers18, } from "../utils/definedConst";
import parseContractCallData from "./parseContractCallData";
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
        let json = await parse.json();
        if (json?.data?.address?.length <= 0) {
            return;
        }
        // errors
        if (json?.errors?.length > 0) {
            console.log("[Error] -> Ошибка при получении адреса:");
            for (let error of json.errors) {
                if (error.message) {
                    console.dir(error.message);
                }
                if (error.message.includes("invalid input syntax")) {
                    database.deleteContract(doc);
                    return;
                }
            }
        }
        let id = json.data.address[0].id;
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
        json = await parse.json();
        // errors
        if (json?.errors?.length > 0) {
            console.log("[Error] -> Ошибка при получении информации о контракте:");
            for (let error of json.errors) {
                if (error.message) {
                    console.dir(error.message);
                }
            }
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
            let result = parseContractCallData(invoke.parsed_calldata);
            if (result.token.includes(ethIdentifier)) {
                invokeSwapVolumeEth += result.amount;
            }
            else if (stableIdentifiers18.some((v) => result.token.includes(v)) ||
                stableIdentifiers6.some((v) => result.token.includes(v))) {
                invokeSwapVolumeStables += result.amount;
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
        console.log("[Error] -> ");
        console.dir(e);
        if (retries > 0 && !e?.message?.includes("string longer than")) {
            await sleep(1000);
            return parseSingleContract(doc, database, parseUrl, retries - 1);
        }
    }
};
export default parseSingleContract;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFyc2VTaW5nbGVDb250cmFjdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zZXJ2aWNlcy9wYXJzZVNpbmdsZUNvbnRyYWN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLHVEQUF1RDtBQUN2RCxPQUFPLEtBQUssTUFBTSxZQUFZLENBQUM7QUFJL0IsT0FBTyxFQUNMLEtBQUssRUFDTCx1QkFBdUIsRUFDdkIsYUFBYSxFQUNiLHNCQUFzQixHQUN2QixNQUFNLGlCQUFpQixDQUFDO0FBQ3pCLE9BQU8sRUFDTCxpQkFBaUIsRUFDakIsY0FBYyxFQUNkLGFBQWEsRUFDYixtQkFBbUIsRUFDbkIsa0JBQWtCLEVBQ2xCLG1CQUFtQixHQUNwQixNQUFNLHVCQUF1QixDQUFDO0FBQy9CLE9BQU8scUJBQXFCLE1BQU0seUJBQXlCLENBQUM7QUFFNUQsTUFBTSxtQkFBbUIsR0FTckIsS0FBSyxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsUUFBUSxFQUFFLE9BQU8sRUFBRSxFQUFFO0lBQzdDLElBQUk7UUFDRixJQUFJLEtBQUssR0FBRyxXQUFXLENBQUMsR0FBRyxFQUFFLENBQUM7UUFDOUIsY0FBYztRQUNkLElBQUksS0FBSyxHQUFHLE1BQU0sS0FBSyxDQUFDLFFBQVEsRUFBRTtZQUNoQyxNQUFNLEVBQUUsTUFBTTtZQUNkLE9BQU8sRUFBRTtnQkFDUCxNQUFNLEVBQUUsa0JBQWtCO2dCQUMxQixjQUFjLEVBQUUsa0JBQWtCO2FBQ25DO1lBQ0QsSUFBSSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUM7Z0JBQ25CLEtBQUssRUFBRSxnREFBZ0QsdUJBQXVCLENBQzVFLEdBQUcsQ0FBQyxRQUFRLENBQ2IsZUFBZTthQUNqQixDQUFDO1NBQ0gsQ0FBQyxDQUFDO1FBQ0gsSUFBSSxJQUFJLEdBQVEsTUFBTSxLQUFLLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDbkMsSUFBSSxJQUFJLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxNQUFN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