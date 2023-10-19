import { Worker } from 'worker_threads';
import { DateTime } from "luxon";
import Database from "./Database";
import { countTime, sleep, deepMergeSum } from "../utils/common";

class Cache {
    private cacheBalance: any = {status: false, error: "Данные еще не загружены.."};
    private cacheTx: any = {status: false, error: "Данные еще не загружены.."};
    private cacheActivity: any = {status: false, error: "Данные еще не загружены.."};
    private cacheTotalWallets: any = {status: false, error: "Данные еще не загружены.."};
    private cacheVolume: any = {status: false, error: "Данные еще не загружены.."};

    constructor(public database: Database, public parseUrl: string) {
    }

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

    updateCacheBalance(cache: any) {
        this.cacheBalance = cache;
    }

    updateCacheTx(cache: any) {
        this.cacheTx = cache;
    }

    updateCacheActivity(cache: any) {
        this.cacheActivity = cache;
    }

    updateCacheTotalWallets(cache: any) {
        this.cacheTotalWallets = cache;
    }

    updateCacheVolume(cache: any) {
        this.cacheVolume = cache;
    }

    async startUpdateOnInterval(timeSec: number, cores: number): Promise<void> {
        let startTime = performance.now();
        console.log("[Cache] -> Начали обновлять кеш..");
        await new Promise((resolve) => {
            let worker = new Worker(new URL('../services/cacheUpdateWorker.ts', import.meta.url), { workerData: { database: this.database, limit: 0, skip: 0, isCache: true }, execArgv: ['--loader', 'ts-node/esm/transpile-only'] });
            worker.on("message", (msg) => {
                if (msg.hasOwnProperty("totalWallets")) {
                    this.updateCacheTotalWallets(msg.totalWallets);
                }
            });
            worker.on("error", (e) => console.log("[Error] -> ", e));
            worker.on("exit", async _ => {
                resolve(true);
            });
        });
        let limit = Math.floor(this.getCacheTotalWallets().data.totalWalletsFiltered / cores);
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
                }
            }
        };
        let tx = {
            data: {
                users_by_tx: {
                    1: 0,
                    5: 0,
                    10: 0,
                    20: 0,
                    30: 0,
                }
            }
        };
        let balance = {
            data: {
                lessThan5of1000: 0,
                lessThan1of100: 0,
                lessThan1of10: 0,
                lessThan1of2: 0,
                lessThan1: 0,
            }
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
                    "all": 0
                },
                users_by_weeks: {
                    1: 0,
                    2: 0,
                    3: 0,
                    4: 0,
                    5: 0,
                    "all": 0
                },
                users_by_months: {
                    1: 0,
                    2: 0,
                    3: 0,
                    4: 0,
                    5: 0,
                    "all": 0
                }
            }
        };
        for (let i = 0; i < cores; i++) {
            if (i === cores - 1) {
                limit = 0;
            }
            promises.push(new Promise((resolve) => {
                let worker = new Worker(new URL('../services/cacheUpdateWorker.ts', import.meta.url), { workerData: { database: this.database, limit, skip, isCache: false }, execArgv: ['--loader', 'ts-node/esm/transpile-only'] });
                worker.on("message", (msg) => {
                    if (msg.hasOwnProperty("volume")) {
                        volume.data.bridgesVolume = deepMergeSum(msg.volume.data.bridgesVolume, volume.data.bridgesVolume) as any;
                        volume.data.bridgesWithCexVolume = deepMergeSum(msg.volume.data.bridgesWithCexVolume, volume.data.bridgesWithCexVolume) as any;
                    } else if (msg.hasOwnProperty("tx")) {
                        tx.data.users_by_tx = deepMergeSum(msg.tx.data.users_by_tx, tx.data.users_by_tx) as any;
                    } else if (msg.hasOwnProperty("balance")) {
                        balance.data = deepMergeSum(msg.balance.data, balance.data) as any;
                    } else if (msg.hasOwnProperty("activity")) {
                        activity.data.users_by_days = deepMergeSum(msg.activity.data.users_by_days, activity.data.users_by_days) as any;
                        activity.data.users_by_weeks = deepMergeSum(msg.activity.data.users_by_weeks, activity.data.users_by_weeks) as any;
                        activity.data.users_by_months = deepMergeSum(msg.activity.data.users_by_months, activity.data.users_by_months) as any;
                    }
                });
                worker.on("error", (e) => console.log("[Error] -> ", e));
                worker.on("exit", async _ => {
                    resolve(true);
                });
            }));
            skip += limit;
        }
        await Promise.allSettled(promises);
        this.updateCacheVolume(volume);
        this.updateCacheTx(tx);
        this.updateCacheBalance(balance);
        this.updateCacheActivity(activity);
        let endTime = performance.now();
        let executionTime = endTime - startTime;
        console.log(`[Cache] -> Кеш обновлен за ${countTime(Math.floor(executionTime / 1000), true)}..`);
        console.log(`[Cache] -> Задержка ${countTime(timeSec, true)}до нового парсинга..`);
        await sleep(timeSec * 1000);
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
            let lastTimestamp = timestamps.shift() as number * 1000;
            for (let timestamp of timestamps) {
                timestamp *= 1000;
                let last, current;
                let lastDate = DateTime.fromMillis(lastTimestamp, { zone: "utc" });
                let currentDate = DateTime.fromMillis(timestamp, { zone: "utc" });
                switch (delimiter) {
                    case 86400:
                        last = lastDate.day;
                        current = currentDate.day;
                        if (current != last || this.compareByMonthAndYear(lastDate.month, currentDate.month, lastDate.year, currentDate.year)) {
                            lastTimestamp = timestamp;
                            count++;
                        }
                        break;
                    case 604800:
                        last = this.getWeek(lastDate);
                        current = this.getWeek(currentDate);
                        if (current != last || this.compareByMonthAndYear(lastDate.month, currentDate.month, lastDate.year, currentDate.year)) {
                            lastTimestamp = timestamp;
                            count++;
                        }
                        break;
                    case 2592000:
                        last = lastDate.month;
                        current = currentDate.month;
                        if (current != last || this.compareByYear(lastDate.year, currentDate.year)) {
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
        let dayOfYear = Math.floor((date.toMillis() - onejan.toMillis()) / 86400000);
        return Math.ceil(dayOfYear / 7);
    }

    private compareByMonthAndYear(lastMonth: number, currentMonth: number, lastYear: number, currentYear: number) {
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