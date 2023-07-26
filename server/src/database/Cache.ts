import { countTime, sleep } from "../utils/common";
import { parseStarkScan } from "../services/parseStarkScan";
import { iterateContracts } from "../services/iterateContracts";
import { Database } from "./Database";
import { HttpsProxyAgent } from "https-proxy-agent";
import Contract from "./models/Contract";

export class Cache {
    private stop: boolean;
    private cacheBalance: any = {status: false, error: "Данные еще не загружены.."};
    private cacheTx: any = {status: false, error: "Данные еще не загружены.."};
    private cacheActivity: any = {status: false, error: "Данные еще не загружены.."};
    private cacheTotalWallets: any = {status: false, error: "Данные еще не загружены.."};
    private cacheVolume: any = {status: false, error: "Данные еще не загружены.."};

    constructor(public database: Database, public proxy: HttpsProxyAgent<string> | boolean, public parseUrl: string) {
        this.stop = false;
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

    stopUpdateOnInterval() {
        this.stop = true;
    }

    async startUpdateOnInterval(timeSec: number) {
        while (!this.stop) {
            try {
                let time = Math.round(Date.now() / 1000 - timeSec);
                await parseStarkScan(null, time, this.database, this.proxy, false, this.parseUrl);
                iterateContracts(this.database, true, this.proxy, this.parseUrl);
                let contracts = await this.database.readFilteredContracts(this.database.filterOutdated);
                if (!contracts) {
                    this.cacheBalance, this.cacheTx, this.cacheActivity = { status: false, error: "Api not available" };
                } else {
                    // total
                    let totalWallets = await Contract.count({ nonce: { "$ne": 0 } });
                    let totalWalletsFiltered = await Contract.count(this.database.filterOutdated);
                    this.updateCacheTotalWallets({data: { totalWallets, totalWalletsFiltered }})
                    // volume
                    let bridgesVolume = contracts.map((e) => e.bridgesVolume);
                    let bridgesWithCexVolume = contracts.map((e) => e.bridgesWithCexVolume);
                    let lessThan5of1000 = 0;
                    let lessThan1of100 = 0;
                    let lessThan1of10 = 0;
                    let lessThan1of2 = 0;
                    let lessThan1 = 0;
                    let lessThan5of1000_2 = 0;
                    let lessThan1of100_2 = 0;
                    let lessThan1of10_2 = 0;
                    let lessThan1of2_2 = 0;
                    let lessThan1_2 = 0;
                    for (let bal of bridgesVolume) {
                        if (bal === 0) continue;
                        if (bal < 0.005) {
                            lessThan5of1000++;
                        } else if (bal < 0.01) {
                            lessThan1of100++;
                        } else if (bal < 0.1) {
                            lessThan1of10++;
                        } else if (bal < 0.5) {
                            lessThan1of2++;
                        } else if (typeof bal === "number") {
                            lessThan1++;
                        }
                    }
                    for (let bal of bridgesWithCexVolume) {
                        if (bal === 0) continue;
                        if (bal < 0.005) {
                            lessThan5of1000_2++;
                        } else if (bal < 0.01) {
                            lessThan1of100_2++;
                        } else if (bal < 0.1) {
                            lessThan1of10_2++;
                        } else if (bal < 0.5) {
                            lessThan1of2_2++;
                        } else if (typeof bal === "number") {
                            lessThan1_2++;
                        }
                    }
                    this.updateCacheVolume({
                        data: {
                            bridgesVolume: {
                                lessThan5of1000,
                                lessThan1of100,
                                lessThan1of10,
                                lessThan1of2,
                                lessThan1,
                            },
                            bridgesWithCexVolume: {
                                lessThan5of1000: lessThan5of1000_2,
                                lessThan1of100: lessThan1of100_2,
                                lessThan1of10: lessThan1of10_2,
                                lessThan1of2: lessThan1of2_2,
                                lessThan1: lessThan1_2,
                            }
                        }
                    });
                    // tx
                    let uniqNonces = {
                        1: 0,
                        5: 0,
                        10: 0,
                        20: 0,
                        30: 0,
                      };
                    for (let contract of contracts) {
                        if (contract.nonce === 0) continue;
                        if (contract.nonce <= 5) {
                            uniqNonces[1]++;
                        } else if (contract.nonce <= 10) {
                            uniqNonces[5]++;
                        } else if (contract.nonce <= 20) {
                            uniqNonces[10]++;
                        } else if (contract.nonce <= 30) {
                            uniqNonces[20]++;
                        } else if (typeof contract.nonce === "number") {
                            uniqNonces[30]++;
                        }
                    }
                    this.updateCacheTx({ data: { users_by_tx: uniqNonces } });
                    // balances
                    let balances = contracts.map((e) => e.balance);
                    lessThan5of1000 = 0;
                    lessThan1of100 = 0;
                    lessThan1of10 = 0;
                    lessThan1of2 = 0;
                    lessThan1 = 0;
                    for (let bal of balances) {
                        if (bal === 0) continue;
                        if (bal < 0.005) {
                            lessThan5of1000++;
                        } else if (bal < 0.01) {
                            lessThan1of100++;
                        } else if (bal < 0.1) {
                            lessThan1of10++;
                        } else if (bal < 0.5) {
                            lessThan1of2++;
                        } else if (typeof bal === "number") {
                            lessThan1++;
                        }
                    }
                    this.updateCacheBalance({
                        data: {
                            lessThan5of1000,
                            lessThan1of100,
                            lessThan1of10,
                            lessThan1of2,
                            lessThan1,
                        }
                    });
                    // activity by days / weeks / months
                    let timestampsAll = contracts.map((e) => e.txTimestamps);
                    let countedDays = this.activeCount(timestampsAll, 86400);
                    let uniqDays = {
                        1: 0,
                        2: 0,
                        3: 0,
                        4: 0,
                        5: 0,
                        10: 0,
                        20: 0,
                        30: 0,
                        "all": 0
                      };
                    for (let userDays of countedDays) {
                        if (userDays <= 1) {
                            uniqDays[1]++;
                        } else if (userDays <= 2) {
                            uniqDays[2]++;
                        } else if (userDays <= 3) {
                            uniqDays[3]++;
                        } else if (userDays <= 4) {
                            uniqDays[4]++;
                        } else if (userDays <= 5) {
                            uniqDays[5]++;
                        } else if (userDays <= 9) {
                            uniqDays[10]++;
                        } else if (userDays <= 19) {
                            uniqDays[20]++;
                        } else if (userDays <= 29) {
                            uniqDays[30]++;
                        } else if (typeof userDays === "number") {
                            uniqDays["all"]++;
                        }
                    }
                    timestampsAll = contracts.map((e) => e.txTimestamps);
                    let countedWeeks = this.activeCount(timestampsAll, 604800);
                    let uniqWeeks = {
                        1: 0,
                        2: 0,
                        3: 0,
                        4: 0,
                        5: 0,
                        "all": 0
                      };
                    for (let userWeeks of countedWeeks) {
                        if (userWeeks <= 1) {
                            uniqWeeks[1]++;
                        } else if (userWeeks <= 2) {
                            uniqWeeks[2]++;
                        } else if (userWeeks <= 3) {
                            uniqWeeks[3]++;
                        } else if (userWeeks <= 4) {
                            uniqWeeks[4]++;
                        } else if (userWeeks <= 5) {
                            uniqWeeks[5]++;
                        } else if (typeof userWeeks === "number") {
                            uniqWeeks["all"]++;
                        }
                    }
                    timestampsAll = contracts.map((e) => e.txTimestamps);
                    let countedMonths = this.activeCount(timestampsAll, 2592000);
                    let uniqMonths = {
                        1: 0,
                        2: 0,
                        3: 0,
                        4: 0,
                        5: 0,
                        "all": 0
                      };
                    for (let userMonths of countedMonths) {
                        if (userMonths <= 1) {
                            uniqMonths[1]++;
                        } else if (userMonths <= 2) {
                            uniqMonths[2]++;
                        } else if (userMonths <= 3) {
                            uniqMonths[3]++;
                        } else if (userMonths <= 4) {
                            uniqMonths[4]++;
                        } else if (userMonths <= 5) {
                            uniqMonths[5]++;
                        } else if (typeof userMonths === "number") {
                            uniqMonths["all"]++;
                        }
                    }
                    this.updateCacheActivity({ data: { users_by_days: uniqDays, users_by_weeks: uniqWeeks, users_by_months: uniqMonths } });
                }
            } catch (e) {
                console.log("[Error] -> ", e);
            }
            console.log(`[Wait] -> Задержка ${countTime(timeSec, true)}до нового парсинга..`);
            await sleep(timeSec * 1000);
        }
    }

    activeCount(timestampsAll: number[][], delimiter: number) {
        let byCounts = [];
        for (let timestamps of timestampsAll) {
            timestamps = timestamps.sort();
            if (timestamps.length <= 0) continue;
            let lastTimestamp = timestamps[0];
            let count = 1;
            if (timestamps.length == 1) {
                // only one tx
                byCounts.push(count);
                continue;
            }
            for (let timestamp of timestamps) {
                if (timestamp - lastTimestamp >= delimiter) {
                    lastTimestamp = timestamp;
                    count++;
                }
            }
            byCounts.push(count);
        }
        return byCounts;
    }
}