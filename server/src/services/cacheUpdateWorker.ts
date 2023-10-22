import { parentPort, workerData } from 'worker_threads';
import mongoose from "mongoose";
import { DateTime } from "luxon";
import { exit } from 'process';

// Это файл с воркером, который запускается отдельным инстансом nodejs
// Поэтому пришлось сюда скопировать некоторый код существующий

interface IContract {
    contract: string;
    nonce: number;
    balance: number;
    txTimestamps: number[],
    bridgesVolume: number,
    bridgesWithCexVolume: number,
    internalVolume: number,
    internalVolumeStables: number,
}
  
const schema = new mongoose.Schema<IContract>({
    contract: { type: String, unique: true, require: true },
    nonce: Number,
    balance: Number,
    txTimestamps: [Number],
    bridgesVolume: Number,
    bridgesWithCexVolume: Number,
    internalVolume: Number,
    internalVolumeStables: Number,
  });
  
const Contract = mongoose.model("Contract", schema);

const getWeek = (date: DateTime) => {
    let onejan = DateTime.utc(date.year, 1, 1);
    let dayOfYear = Math.floor((date.toMillis() - onejan.toMillis()) / 86400000);
    return Math.ceil(dayOfYear / 7);
}

const compareByMonthAndYear = (lastMonth: number, currentMonth: number, lastYear: number, currentYear: number) => {
    if (lastMonth != currentMonth || lastYear != currentYear) {
        return true;
    }
    return false;
}

const compareByYear = (lastYear: number, currentYear: number) => {
    if (lastYear != currentYear) {
        return true;
    }
    return false;
}

try {
    let { database, limit, skip, isCache } = workerData;
    await mongoose.connect(database.url);
    if (isCache) {
         // total
        let totalWalletsFiltered = await Contract.count(database.filterOutdated);
        let totalWallets = await Contract.count({ nonce: { "$ne": 0 } });
        if (parentPort) {
            parentPort.postMessage({ totalWallets: { data: { totalWallets, totalWalletsFiltered }}});
        }
        exit(0);
    }
    if (parentPort) {
        // eth price
        let ethPriceQuery = await fetch("https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD");
        let ethPriceJson = await ethPriceQuery.json();
        let ethPrice = +ethPriceJson.USD;
        parentPort.postMessage({ ethPrice });
        // volume
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
        // internal volume
        let internal50 = 0;
        let internal500 = 0;
        let internal1000 = 0;
        let internal5000 = 0;
        let internal10000 = 0;
        let internal50000 = 0;
        let internalMore = 0;
        // tx
        let uniqNonces = {
            1: 0,
            5: 0,
            10: 0,
            20: 0,
            30: 0,
            50: 0,
          };
        // balances
        let lessThan5of1000_b = 0;
        let lessThan1of100_b = 0;
        let lessThan1of10_b = 0;
        let lessThan1of2_b = 0;
        let lessThan1_b = 0;
        // activity
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
        let uniqWeeks = {
            1: 0,
            2: 0,
            3: 0,
            4: 0,
            5: 0,
            "all": 0
          };
        let uniqMonths = {
            1: 0,
            2: 0,
            3: 0,
            4: 0,
            5: 0,
            "all": 0
          };
        let byCountsDays: number[] = [];
        let byCountsWeeks: number[] = [];
        let byCountsMonths: number[] = [];
        for await (let contract of Contract.find(database.filterOutdated).limit(limit).skip(skip).lean()) {
            // volume
            if (contract.bridgesVolume < 0.01 && contract.bridgesVolume > 0) {
                lessThan5of1000++;
            } else if (contract.bridgesVolume < 0.05 && contract.bridgesVolume > 0) {
                lessThan1of100++;
            } else if (contract.bridgesVolume < 0.1 && contract.bridgesVolume > 0) {
                lessThan1of10++;
            } else if (contract.bridgesVolume < 0.5 && contract.bridgesVolume > 0) {
                lessThan1of2++;
            } else if (typeof contract.bridgesVolume === "number" && contract.bridgesVolume > 0) {
                lessThan1++;
            }
            if (contract.bridgesWithCexVolume < 0.01 && contract.bridgesWithCexVolume > 0) {
                lessThan5of1000_2++;
            } else if (contract.bridgesWithCexVolume < 0.05 && contract.bridgesWithCexVolume > 0) {
                lessThan1of100_2++;
            } else if (contract.bridgesWithCexVolume < 0.1 && contract.bridgesWithCexVolume > 0) {
                lessThan1of10_2++;
            } else if (contract.bridgesWithCexVolume < 0.5 && contract.bridgesWithCexVolume > 0) {
                lessThan1of2_2++;
            } else if (typeof contract.bridgesWithCexVolume === "number" && contract.bridgesWithCexVolume > 0) {
                lessThan1_2++;
            }
            // internal volume
            let totalInternalVolume = ethPrice * contract.internalVolume + contract.internalVolumeStables;
            if (totalInternalVolume < 50 && totalInternalVolume > 0) {
                internal50++;
            } else if (totalInternalVolume < 500 && totalInternalVolume > 0) {
                internal500++;
            } else if (totalInternalVolume < 1000 && totalInternalVolume > 0) {
                internal1000++;
            } else if (totalInternalVolume < 5000 && totalInternalVolume > 0) {
                internal5000++;
            } else if (totalInternalVolume < 10000 && totalInternalVolume > 0) {
                internal10000++;
            } else if (totalInternalVolume < 50000 && totalInternalVolume > 0) {
                internal50000++;
            } else if (typeof totalInternalVolume === "number" && totalInternalVolume > 0) {
                internalMore++;
            }
            // tx
            if (contract.nonce <= 5 && contract.nonce > 0) {
                uniqNonces[1]++;
            } else if (contract.nonce <= 10 && contract.nonce > 0) {
                uniqNonces[5]++;
            } else if (contract.nonce <= 20 && contract.nonce > 0) {
                uniqNonces[10]++;
            } else if (contract.nonce <= 30 && contract.nonce > 0) {
                uniqNonces[20]++;
            } else if (contract.nonce <= 50 && contract.nonce > 0) {
                uniqNonces[30]++;
            } else if (typeof contract.nonce === "number" && contract.nonce > 0) {
                uniqNonces[50]++;
            }
            // balances
            if (contract.balance < 0.005 && contract.balance > 0) {
                lessThan5of1000_b++;
            } else if (contract.balance < 0.01 && contract.balance > 0) {
                lessThan1of100_b++;
            } else if (contract.balance < 0.1 && contract.balance > 0) {
                lessThan1of10_b++;
            } else if (contract.balance < 0.5 && contract.balance > 0) {
                lessThan1of2_b++;
            } else if (typeof contract.balance === "number" && contract.balance > 0) {
                lessThan1_b++;
            }
            // activity by days / weeks / months
            let timestamps = [...contract.txTimestamps].sort();
            if (timestamps.length > 0) {
                let countDays = 1, countWeeks = 1, countMonths = 1;
                if (timestamps.length > 1) {
                    let lastTimestampDays = timestamps[0] * 1000, lastTimestampWeeks = timestamps[0] * 1000, lastTimestampMonths = timestamps[0] * 1000;
                    let skip = true;
                    for (let timestamp of timestamps) {
                        if (skip) {
                            skip = false;
                            continue;
                        }
                        timestamp *= 1000;
                        let lastDateDays = DateTime.fromMillis(lastTimestampDays, { zone: "utc" });
                        let lastDateWeeks = DateTime.fromMillis(lastTimestampWeeks, { zone: "utc" });
                        let lastDateMonths = DateTime.fromMillis(lastTimestampMonths, { zone: "utc" });
                        let currentDate = DateTime.fromMillis(timestamp, { zone: "utc" });
                        let last = lastDateDays.day;
                        let current = currentDate.day;
                        if (current != last || compareByMonthAndYear(lastDateDays.month, currentDate.month, lastDateDays.year, currentDate.year)) {
                            lastTimestampDays = timestamp;
                            countDays++;
                        }
                        last = getWeek(lastDateWeeks);
                        current = getWeek(currentDate);
                        if (current != last || compareByMonthAndYear(lastDateWeeks.month, currentDate.month, lastDateWeeks.year, currentDate.year)) {
                            lastTimestampWeeks = timestamp;
                            countWeeks++;
                        }
                        last = lastDateMonths.month;
                        current = currentDate.month;
                        if (current != last || compareByYear(lastDateMonths.year, currentDate.year)) {
                            lastTimestampMonths = timestamp;
                            countMonths++;
                        }
                    }
                }
                byCountsDays.push(countDays);
                byCountsWeeks.push(countWeeks);
                byCountsMonths.push(countMonths);
            }
        }
        parentPort.postMessage({
            volume: {
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
            }
        });
        parentPort.postMessage({ 
            internalVolume: {
                data: {
                    internal50,
                    internal500,
                    internal1000,
                    internal5000,
                    internal10000,
                    internal50000,
                    internalMore,
                }
            }
        });
        parentPort.postMessage({ tx: { data: { users_by_tx: uniqNonces } } });
        parentPort.postMessage({ 
            balance: {
                data: {
                    lessThan5of1000: lessThan5of1000_b,
                    lessThan1of100: lessThan1of100_b,
                    lessThan1of10: lessThan1of10_b,
                    lessThan1of2: lessThan1of2_b,
                    lessThan1: lessThan1_b,
                }
            }
        });
        // activity by days / weeks / months   
        for (let userDays of byCountsDays) {
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
        for (let userWeeks of byCountsWeeks) {
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
        for (let userMonths of byCountsMonths) {
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
        parentPort.postMessage({ activity: { data: { users_by_days: uniqDays, users_by_weeks: uniqWeeks, users_by_months: uniqMonths }}});
        exit(0);
    }
} catch (e) {
    console.log("[Error] -> ", e);
}