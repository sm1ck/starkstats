import mongoose, { FilterQuery } from "mongoose";
import Contract, { IContract } from "./models/Contract";

class Database {
  public filterOutdated = {
    $and: [
      {
        nonce: {
          $ne: 0,
        },
      },
      {
        $and: [
          {
            nonce: {
              $ne: 1,
            },
          },
          {
            balance: {
              $ne: 0,
            },
          },
        ],
      },
    ],
  };

  constructor(public url: string) {
    this.url = url;
    this.connect();
  }

  async connect() {
    await mongoose.connect(this.url);
  }

  async writeContracts(
    contracts:
      | Array<typeof Contract>
      | (mongoose.Document<unknown, NonNullable<unknown>, IContract> &
          IContract & {
            _id: mongoose.Types.ObjectId;
          })[],
  ) {
    await Contract.insertMany(contracts, { ordered: false })
      .catch((e) => {
        if (e?.stack?.includes("duplicate key")) {
          let successInsert = e?.result?.insertedCount;
          console.log(
            `[Insert] -> Данные уже есть в таблице, успешно сохранено ${successInsert} контрактов..`,
          );
        } else {
          console.log("[Insert Error] -> ", e);
        }
      })
      .then(() =>
        console.log(`[Insert] -> Сохранено ${contracts.length} контрактов..`),
      );
  }

  async updateContract(doc: mongoose.HydratedDocument<IContract>) {
    await doc
      .save()
      .catch((e) => console.log(`[Error on save to db] -> `, e))
      .then(() =>
        console.log(
          `[Update] -> Контракт: ${doc.contract}, всего транзакций: ${doc.nonce}, баланс: ${doc.balance} ETH, объем через мост: ${doc.bridgesVolume} ETH, объем через мост + биржи: ${doc.bridgesWithCexVolume} ETH, объем внутри сети: ${doc.internalVolume} ETH, объем внутри сети: ${doc.internalVolumeStables}$`,
        ),
      );
  }

  async deleteContract(doc: mongoose.HydratedDocument<IContract>) {
    await doc
      .deleteOne()
      .catch((e) => console.log(`[Error on delete to db] -> `, e))
      .then(() => console.log(`[Update] -> Контракт ${doc.contract} удален..`));
  }

  async readContracts() {
    let contracts = await Contract.find();
    return contracts;
  }

  async readFilteredContracts(
    filter: FilterQuery<IContract>,
    limit?: number,
    skip?: number,
  ) {
    let contracts =
      limit !== undefined && skip !== undefined
        ? await Contract.find(filter).limit(limit).skip(skip)
        : await Contract.find(filter);
    return contracts;
  }
}

export default Database;
