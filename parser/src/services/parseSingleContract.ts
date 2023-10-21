import fetch from "node-fetch";
import mongoose from "mongoose";
import Database from "../database/Database";
import { IContract } from "../database/models/Contract";
import { sleep, convertToGraphQlAddress, formatBalance, convertToNormalAddress } from "../utils/common";
import { bridgeIdentifiers, cexIdentifiers, ethIdentifier, protocolIdentifiers, stableIdentifiers6, stableIdentifiers18 } from "../utils/definedConst";
import parseContractCallData from "./parseContractCallData";

const parseSingleContract: (
  doc: mongoose.HydratedDocument<IContract>,
  database: Database,
  parseUrl: string,
  hasuraSecret: string,
  retries: number,
) => Promise<void> = async (doc, database, parseUrl, hasuraSecret, retries) => {
  try {
    // first parse
    let parse = await fetch(parseUrl, {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        "Hasura-Client-Name": "hasura-console",
        "X-Hasura-Admin-Secret": hasuraSecret,
      },
      body: JSON.stringify({
        'query': `query MyQuery { address(where: {hash: {_eq: "${convertToGraphQlAddress(doc.contract)}"}}) { id } }`,
      }),
    });
    let json: any = await parse.json();
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
        "Hasura-Client-Name": "hasura-console",
        "X-Hasura-Admin-Secret": hasuraSecret,
      },
      body: JSON.stringify({
        'query': `query MyQuery { invoke( where: {contract: {id: {_eq: ${id}}}} ) { time parsed_calldata} transfer( where: {_or: [{from_id: {_eq: ${id}}} {to_id: {_eq: ${id}}}]} ) { from { hash } to { hash } token { contract { hash } } amount } deploy(where: {contract: {id: {_eq: ${id}}}}) { time } deploy_account(where: {contract: {id: {_eq: ${id}}}}) { time } token_balance(where: {owner_id: {_eq: ${id}}, token_id: {_eq: 0}}) { balance } }`,
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
    let balance = json.data.token_balance.length > 0 ? formatBalance(BigInt(json.data.token_balance[0].balance), 18) : 0;
    if (doc.nonce === undefined || nonce > doc.nonce) {
      doc.nonce = nonce;
    }
    if (doc.balance === undefined || balance > 0) {
      doc.balance = balance;
    }
    let txTimestamps: Array<number> = [];
    txTimestamps = json.data.deploy.reduce((acc: Array<number>, curr: any) => {
      acc.push(Math.floor(new Date(curr.time).getTime() / 1000));
      return acc;
    }, []);
    if (txTimestamps.length === 0) {
      txTimestamps = json.data.deploy_account.reduce((acc: Array<number>, curr: any) => {
        acc.push(Math.floor(new Date(curr.time).getTime() / 1000));
        return acc;
      }, []);
    }
    let invokeTimestamps: Array<number> = json.data.invoke.reduce((acc: Array<number>, curr: any) => {
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
      } else if (stableIdentifiers18.some((v) => result.token.includes(v)) || stableIdentifiers6.some((v) => result.token.includes(v))) {
        invokeSwapVolumeStables += result.amount;
      }
    }
    let bridgesVolume: number = json.data.transfer.reduce((total: number, curr: any) => {
      if (curr?.from?.hash && curr?.to?.hash && curr?.token?.contract?.hash && convertToNormalAddress(curr.token.contract.hash).includes(ethIdentifier) && bridgeIdentifiers.some((v) => convertToNormalAddress(curr.from.hash).includes(v) || convertToNormalAddress(curr.to.hash).includes(v))) {
          total += formatBalance(BigInt(curr.amount), 18);
      }
      return total;
    }, 0);
    let bridgesWithCexVolume: number = json.data.transfer.reduce((total: number, curr: any) => {
      if (curr?.from?.hash && curr?.to?.hash && curr?.token?.contract?.hash && convertToNormalAddress(curr.token.contract.hash).includes(ethIdentifier) && (bridgeIdentifiers.some((v) => convertToNormalAddress(curr.from.hash).includes(v) || convertToNormalAddress(curr.to.hash).includes(v)) || cexIdentifiers.some((v) => convertToNormalAddress(curr.from.hash).includes(v) || convertToNormalAddress(curr.to.hash).includes(v)))) {
        total += formatBalance(BigInt(curr.amount), 18);
      }
    return total;
    }, 0);
    let internalVolume: number = json.data.transfer.reduce((total: number, curr: any) => {
      if (curr?.from?.hash && curr?.to?.hash && curr?.token?.contract?.hash && convertToNormalAddress(curr.token.contract.hash).includes(ethIdentifier) && protocolIdentifiers.some((v) => convertToNormalAddress(curr.from.hash).includes(v) || convertToNormalAddress(curr.to.hash).includes(v))) {
          total += formatBalance(BigInt(curr.amount), 18);
      }
      return total;
    }, 0);
    let internalVolumeStables6: number = json.data.transfer.reduce((total: number, curr: any) => {
      if (curr?.from?.hash && curr?.to?.hash && curr?.token?.contract?.hash && stableIdentifiers6.some((v) => convertToNormalAddress(curr.token.contract.hash).includes(v)) && protocolIdentifiers.some((v) => convertToNormalAddress(curr.from.hash).includes(v) || convertToNormalAddress(curr.to.hash).includes(v))) {
          total += formatBalance(BigInt(curr.amount), 6);
      }
      return total;
    }, 0);
    let internalVolumeStables18: number = json.data.transfer.reduce((total: number, curr: any) => {
      if (curr?.from?.hash && curr?.to?.hash && curr?.token?.contract?.hash && stableIdentifiers18.some((v) => convertToNormalAddress(curr.token.contract.hash).includes(v)) && protocolIdentifiers.some((v) => convertToNormalAddress(curr.from.hash).includes(v) || convertToNormalAddress(curr.to.hash).includes(v))) {
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
    if (doc.bridgesWithCexVolume === undefined || bridgesWithCexVolume > doc.bridgesWithCexVolume) {
      doc.bridgesWithCexVolume = bridgesWithCexVolume;
    }
    if (doc.txTimestamps === undefined || txTimestamps.length > doc.txTimestamps.length) {
      doc.txTimestamps = txTimestamps;
    }
    if (doc.internalVolume === undefined || internalVolume > doc.internalVolume) {
      doc.internalVolume = internalVolume;
    }
    if (doc.internalVolumeStables === undefined || internalVolumeStables > doc.internalVolumeStables) {
      doc.internalVolumeStables = internalVolumeStables;
    }
    await database.updateContract(doc);
    // if (doc.nonce === 0 || doc.txTimestamps.length === 0) {
    //   await database.deleteContract(doc);
    // }
  } catch (e) {
    console.log("[Error] -> ");
    console.dir(e);
    if (retries > 0) {
      await sleep(1000);
      return parseSingleContract(doc, database, parseUrl, hasuraSecret, retries - 1);
    }
  }
};

export default parseSingleContract;