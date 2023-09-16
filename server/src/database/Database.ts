import mongoose from "mongoose";
import Contract, { IContract } from "./models/Contract";

export class Database {
  public filterOutdated = { $and: [
      {
          nonce: {
              "$ne": 0
          }
      },
      {  
          $and: [ 
              { 
                  nonce: { 
                      "$ne": 1 
                  }
              },
              {
                  
                  balance: { 
                      "$ne": 0
                  }
              }
          ]
      }
  ]};

  constructor(public url: string) {
    this.url = url;
    this.connect();
  }

  async connect() {
    await mongoose.connect(this.url);
  }

  async writeContracts(contracts: Array<typeof Contract>) {
    await Contract.insertMany(contracts, { ordered: false });
    console.log(`[Insert] -> Сохранено ${contracts.length} контрактов..`);
  }

  async updateContract(doc: mongoose.HydratedDocument<IContract>) {
    await doc.save();
    console.log(
      `[Update] -> Контракт: ${doc.contract}, всего транзакций: ${doc.nonce}, баланс: ${doc.balance} ETH, объем через мост: ${doc.bridgesVolume} ETH, объем через мост + биржи: ${doc.bridgesWithCexVolume} ETH`
    );
  }

  async deleteContract(doc: mongoose.HydratedDocument<IContract>) {
    await doc.deleteOne();
    console.log(
      `[Update] -> Контракт: ${doc.contract} удален..`
    );
  }

  async readContracts() {
    let contracts = await Contract.find();
    return contracts;
  }

  async readFilteredContracts(filter: any, limit?: number, skip?: number) {
    let contracts = limit !== undefined && skip !== undefined ? await Contract.find(filter).limit(limit).skip(skip) : await Contract.find(filter);
    return contracts;
  }
}
