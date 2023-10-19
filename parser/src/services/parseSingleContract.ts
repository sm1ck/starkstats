import fetch from "node-fetch";
import mongoose from "mongoose";
import Database from "../database/Database";
import { IContract } from "../database/models/Contract";
import { sleep, convertToGraphQlAddress, formatBalance, convertToNormalAddress } from "../utils/common";
import { bridgeIdentifiers, cexIdentifiers } from "../utils/definedConst";

const parseSingleContract: (
  doc: mongoose.HydratedDocument<IContract>,
  database: Database,
  parseUrl: string,
  retries: number
) => Promise<void> = async (doc, database, parseUrl, retries) => {
  try {
    // first parse
    let parse = await fetch(parseUrl, {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
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
      },
      body: JSON.stringify({
        'query': `query MyQuery { invoke( where: {contract: {id: {_eq: ${id}}}} ) { nonce\n time\n id} transfer( where: { to_id: {_eq: ${id}}, token_id: {_eq: 0}}) { from { hash } amount } deploy(where: {contract: {id: {_eq: ${id}}}}) { time } deploy_account(where: {contract: {id: {_eq: ${id}}}}) { time } token_balance(where: {owner_id: {_eq: ${id}}, token_id: {_eq: 0}}) { balance } }`,
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
    if (nonce > doc.nonce) {
      doc.nonce = nonce;
    }
    if (balance > 0) {
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
    let bridgesVolume: number = json.data.transfer.reduce((total: number, curr: any) => {
      if (curr.from && bridgeIdentifiers.some((v) => convertToNormalAddress(curr.from.hash).includes(v))) {
          total += formatBalance(BigInt(curr.amount), 18);
      }
      return total;
    }, 0);
    let bridgesWithCexVolume: number = json.data.transfer.reduce((total: number, curr: any) => {
      if (curr.from && (bridgeIdentifiers.some((v) => convertToNormalAddress(curr.from.hash).includes(v)) || cexIdentifiers.some((v) => convertToNormalAddress(curr.from.hash).includes(v)))) {
        total += formatBalance(BigInt(curr.amount), 18);
      }
    return total;
    }, 0);
    if (bridgesVolume > doc.bridgesVolume) {
      doc.bridgesVolume = bridgesVolume;
    }
    if (bridgesWithCexVolume > doc.bridgesWithCexVolume) {
      doc.bridgesWithCexVolume = bridgesWithCexVolume;
    }
    if (txTimestamps.length > doc.txTimestamps.length) {
      doc.txTimestamps = txTimestamps;
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
      return parseSingleContract(doc, database, parseUrl, retries - 1);
    }
  }
};

export default parseSingleContract;