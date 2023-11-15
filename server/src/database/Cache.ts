import { Worker } from "worker_threads";
import { DateTime } from "luxon";
import { Database, utils, cacheTypes } from "shared";

class Cache {
  private cacheBalance: cacheTypes.Status | cacheTypes.Balance = {
    status: false,
    error: "Данные еще не загружены..",
  };
  private cacheTx: cacheTypes.Status | cacheTypes.Tx = {
    status: false,
    error: "Данные еще не загружены..",
  };
  private cacheActivity: cacheTypes.Status | cacheTypes.Activity = {
    status: false,
    error: "Данные еще не загружены..",
  };
  private cacheTotalWallets: cacheTypes.Status | cacheTypes.TotalWallets = {
    status: false,
    error: "Данные еще не загружены..",
  };
  private cacheVolume: cacheTypes.Status | cacheTypes.Volume = {
    status: false,
    error: "Данные еще не загружены..",
  };
  private cacheInternalVolume: cacheTypes.Status | cacheTypes.InternalVolume = {
    status: false,
    error: "Данные еще не загружены..",
  };
  private cacheAggregateTx: cacheTypes.Status | cacheTypes.AggregateData = {
    status: false,
    error: "Данные еще не загружены..",
  };
  private cacheAggregateTps: cacheTypes.Status | cacheTypes.AggregateData = {
    status: false,
    error: "Данные еще не загружены..",
  };
  private cacheAggregateUsers: cacheTypes.Status | cacheTypes.AggregateData = {
    status: false,
    error: "Данные еще не загружены..",
  };
  private cacheEthPrice = 0;

  constructor(
    public database: Database,
    public parseUrl: string,
  ) {}

  getCacheBalance() {
    return this.cacheBalance;
  }

  getCacheTx() {
    return this.cacheTx;
  }

  getCacheActivity() {
    return this.cacheActivity;
  }

  getCacheTotalWallets() {
    return this.cacheTotalWallets;
  }

  getCacheVolume() {
    return this.cacheVolume;
  }

  getCacheInternalVolume() {
    return this.cacheInternalVolume;
  }

  getCacheAggregateTx() {
    return this.cacheAggregateTx;
  }

  getCacheAggregateTps() {
    return this.cacheAggregateTps;
  }

  getCacheAggregateUsers() {
    return this.cacheAggregateUsers;
  }

  getCacheEthPrice() {
    return this.cacheEthPrice;
  }

  updateCacheEthPrice(cache: number) {
    this.cacheEthPrice = cache;
  }

  updateCacheBalance(cache: cacheTypes.Balance) {
    this.cacheBalance = cache;
  }

  updateCacheTx(cache: cacheTypes.Tx) {
    this.cacheTx = cache;
  }

  updateCacheActivity(cache: cacheTypes.Activity) {
    this.cacheActivity = cache;
  }

  updateCacheTotalWallets(cache: cacheTypes.TotalWallets) {
    this.cacheTotalWallets = cache;
  }

  updateCacheVolume(cache: cacheTypes.Volume) {
    this.cacheVolume = cache;
  }

  updateCacheInternalVolume(cache: cacheTypes.InternalVolume) {
    this.cacheInternalVolume = cache;
  }

  updateCacheAggregateTx(cache: cacheTypes.AggregateData) {
    this.cacheAggregateTx = cache;
  }

  updateCacheAggregateTps(cache: cacheTypes.AggregateData) {
    this.cacheAggregateTps = cache;
  }

  updateCacheAggregateUsers(cache: cacheTypes.AggregateData) {
    this.cacheAggregateUsers = cache;
  }

  async startUpdateOnInterval(timeSec: number, cores: number): Promise<void> {
    let startTime = performance.now();
    console.log("[Cache] -> Начали обновлять кеш..");
    await new Promise((resolve) => {
      let worker = new Worker(
        new URL("../services/cacheUpdateWorker.ts", import.meta.url),
        {
          workerData: {
            database: this.database,
            limit: 0,
            skip: 0,
            isCache: true,
          },
          execArgv: ["--loader", "ts-node/esm/transpile-only"],
        },
      );
      worker.on("message", (msg) => {
        if (msg?.totalWallets) {
          this.updateCacheTotalWallets(msg.totalWallets);
        }
      });
      worker.on("error", (e) => console.log("[Error] -> ", e));
      worker.on("exit", async () => {
        resolve(true);
      });
    });
    let totalWallets = this.getCacheTotalWallets();
    let limit = Math.floor(
      cacheTypes.isTotalWallets(totalWallets)
        ? totalWallets.data.totalWalletsFiltered / cores
        : 1,
    );
    let skip = 0;
    let promises = [];
    let volume = {
      data: {
        bridgesVolume: {
          lessThan5of1000: 0,
          lessThan1of100: 0,
          lessThan1of10: 0,
          lessThan1of2: 0,
          lessThan1: 0,
        },
        bridgesWithCexVolume: {
          lessThan5of1000: 0,
          lessThan1of100: 0,
          lessThan1of10: 0,
          lessThan1of2: 0,
          lessThan1: 0,
        },
      },
    };
    let internalVolume = {
      data: {
        internal50: 0,
        internal500: 0,
        internal1000: 0,
        internal5000: 0,
        internal10000: 0,
        internal50000: 0,
        internalMore: 0,
      },
    };
    let tx = {
      data: {
        users_by_tx: {
          1: 0,
          5: 0,
          10: 0,
          20: 0,
          30: 0,
          50: 0,
        },
      },
    };
    let balance = {
      data: {
        lessThan5of1000: 0,
        lessThan1of100: 0,
        lessThan1of10: 0,
        lessThan1of2: 0,
        lessThan1: 0,
      },
    };
    let activity = {
      data: {
        users_by_days: {
          1: 0,
          2: 0,
          3: 0,
          4: 0,
          5: 0,
          10: 0,
          20: 0,
          30: 0,
          all: 0,
        },
        users_by_weeks: {
          1: 0,
          2: 0,
          3: 0,
          4: 0,
          5: 0,
          all: 0,
        },
        users_by_months: {
          1: 0,
          2: 0,
          3: 0,
          4: 0,
          5: 0,
          all: 0,
        },
      },
    };
    for (let i = 0; i < cores; i++) {
      if (i === cores - 1) {
        limit = 0;
      }
      promises.push(
        new Promise((resolve) => {
          let worker = new Worker(
            new URL("../services/cacheUpdateWorker.ts", import.meta.url),
            {
              workerData: {
                database: this.database,
                limit,
                skip,
                isCache: false,
              },
              execArgv: ["--loader", "ts-node/esm/transpile-only"],
            },
          );
          worker.on("message", (msg) => {
            if (msg?.volume) {
              let tmpBridgesVolume = utils.deepMergeSum(
                msg.volume.data.bridgesVolume,
                volume.data.bridgesVolume,
              );
              let tmpBridgesWithCexVolume = utils.deepMergeSum(
                msg.volume.data.bridgesWithCexVolume,
                volume.data.bridgesWithCexVolume,
              );
              if (cacheTypes.isVolumeDataFields(tmpBridgesVolume)) {
                volume.data.bridgesVolume = tmpBridgesVolume;
              }
              if (cacheTypes.isVolumeDataFields(tmpBridgesWithCexVolume)) {
                volume.data.bridgesWithCexVolume = tmpBridgesWithCexVolume;
              }
            } else if (msg?.internalVolume) {
              let tmpInternalVolume = utils.deepMergeSum(
                msg.internalVolume.data,
                internalVolume.data,
              );
              if (cacheTypes.isInternalVolumeData(tmpInternalVolume)) {
                internalVolume.data = tmpInternalVolume;
              }
            } else if (msg?.tx) {
              let tmpTx = utils.deepMergeSum(
                msg.tx.data.users_by_tx,
                tx.data.users_by_tx,
              );
              if (cacheTypes.isTxDataFields(tmpTx)) {
                tx.data.users_by_tx = tmpTx;
              }
            } else if (msg?.balance) {
              let tmpBalance = utils.deepMergeSum(
                msg.balance.data,
                balance.data,
              );
              if (cacheTypes.isBalanceData(tmpBalance)) {
                balance.data = tmpBalance;
              }
            } else if (msg?.activity) {
              let tmpActivityByDays = utils.deepMergeSum(
                msg.activity.data.users_by_days,
                activity.data.users_by_days,
              );
              let tmpActivityByWeeks = utils.deepMergeSum(
                msg.activity.data.users_by_weeks,
                activity.data.users_by_weeks,
              );
              let tmpActivityByMonths = utils.deepMergeSum(
                msg.activity.data.users_by_months,
                activity.data.users_by_months,
              );
              if (cacheTypes.isActivityDataDaysFields(tmpActivityByDays)) {
                activity.data.users_by_days = tmpActivityByDays;
              }
              if (
                cacheTypes.isActivityDataWeeksMonthsFields(tmpActivityByWeeks)
              ) {
                activity.data.users_by_weeks = tmpActivityByWeeks;
              }
              if (
                cacheTypes.isActivityDataWeeksMonthsFields(tmpActivityByMonths)
              ) {
                activity.data.users_by_months = tmpActivityByMonths;
              }
            } else if (msg?.ethPrice) {
              this.updateCacheEthPrice(+msg.ethPrice);
            }
          });
          worker.on("error", (e) => console.log("[Error] -> ", e));
          worker.on("exit", async () => {
            resolve(true);
          });
        }),
      );
      skip += limit;
    }
    promises.push(
      new Promise((resolve) => {
        let worker = new Worker(
          new URL("../services/graphqlUpdateWorker.ts", import.meta.url),
          {
            workerData: {
              parseUrl: this.parseUrl,
            },
            execArgv: ["--loader", "ts-node/esm/transpile-only"],
          },
        );
        worker.on("message", (msg) => {
          if (msg?.tx) {
            this.updateCacheAggregateTx(msg.tx);
          } else if (msg?.tps) {
            this.updateCacheAggregateTps(msg.tps);
          } else if (msg?.users) {
            this.updateCacheAggregateUsers(msg.users);
          }
        });
        worker.on("error", (e) => console.log("[Error] -> ", e));
        worker.on("exit", async () => {
          resolve(true);
        });
      }),
    );
    await Promise.allSettled(promises);
    this.updateCacheVolume(volume);
    this.updateCacheInternalVolume(internalVolume);
    this.updateCacheTx(tx);
    this.updateCacheBalance(balance);
    this.updateCacheActivity(activity);
    let endTime = performance.now();
    let executionTime = endTime - startTime;
    console.log(
      `[Cache] -> Кеш обновлен за ${utils.countTime(
        Math.floor(executionTime / 1000),
        true,
      )}..`,
    );
    console.log(
      `[Cache] -> Задержка ${utils.countTime(
        timeSec,
        true,
      )}до нового парсинга..`,
    );
    await utils.sleep(timeSec * 1000);
    return this.startUpdateOnInterval(timeSec, cores);
  }

  activeCount(timestampsAll: number[][], delimiter: number) {
    let byCounts = [];
    for (let timestamps of timestampsAll) {
      timestamps = timestamps.sort();
      if (timestamps.length <= 0) continue;
      let count = 1;
      if (timestamps.length == 1) {
        // only one tx
        byCounts.push(count);
        continue;
      }
      let lastTimestamp = (timestamps.shift() as number) * 1000;
      for (let timestamp of timestamps) {
        timestamp *= 1000;
        let last, current;
        let lastDate = DateTime.fromMillis(lastTimestamp, { zone: "utc" });
        let currentDate = DateTime.fromMillis(timestamp, { zone: "utc" });
        switch (delimiter) {
          case 86400:
            last = lastDate.day;
            current = currentDate.day;
            if (
              current != last ||
              this.compareByMonthAndYear(
                lastDate.month,
                currentDate.month,
                lastDate.year,
                currentDate.year,
              )
            ) {
              lastTimestamp = timestamp;
              count++;
            }
            break;
          case 604800:
            last = this.getWeek(lastDate);
            current = this.getWeek(currentDate);
            if (
              current != last ||
              this.compareByMonthAndYear(
                lastDate.month,
                currentDate.month,
                lastDate.year,
                currentDate.year,
              )
            ) {
              lastTimestamp = timestamp;
              count++;
            }
            break;
          case 2592000:
            last = lastDate.month;
            current = currentDate.month;
            if (
              current != last ||
              this.compareByYear(lastDate.year, currentDate.year)
            ) {
              lastTimestamp = timestamp;
              count++;
            }
            break;
          default:
            last = lastTimestamp;
            current = timestamp;
        }
      }
      byCounts.push(count);
    }
    return byCounts;
  }

  private getWeek(date: DateTime) {
    let onejan = DateTime.utc(date.year, 1, 1);
    let dayOfYear = Math.floor(
      (date.toMillis() - onejan.toMillis()) / 86400000,
    );
    return Math.ceil(dayOfYear / 7);
  }

  private compareByMonthAndYear(
    lastMonth: number,
    currentMonth: number,
    lastYear: number,
    currentYear: number,
  ) {
    if (lastMonth != currentMonth || lastYear != currentYear) {
      return true;
    }
    return false;
  }

  private compareByYear(lastYear: number, currentYear: number) {
    if (lastYear != currentYear) {
      return true;
    }
    return false;
  }
}

export default Cache;
