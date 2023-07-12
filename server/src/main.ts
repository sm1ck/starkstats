import express from "express";
import { Database } from "./database/Database";
import { Cache } from "./database/Cache";
import { parseStarkScan } from "./services/parseStarkScan";
import { hourlyContractsUpdate } from "./services/hourlyContractsUpdate";
import { HttpsProxyAgent } from "https-proxy-agent";
import path from "path";
import { getChecksumAddress } from "starknet";

const app = express();
const port = 5000;
const slowMode = Boolean(process.env.SLOW_MODE) || false;
const isParseAll = Boolean(process.env.PARSE_ALL_CONTRACTS) || true;
const is30mNewInsert = Boolean(process.env.NEW_INSERT_CONTRACTS) || true;
const isHourlyUpdate = Boolean(process.env.UPDATE_CONTRACTS) || true;
const graphlUrl = process.env.GRAPHQL_URL || ""
const database = new Database(
  process.env.MONGODB_URL || "mongodb://root:pass@127.0.0.1:27017"
);
const proxy =
  process.env.PROXY !== undefined
    ? new HttpsProxyAgent(process.env.PROXY)
    : false;
const cache = new Cache(database, proxy, graphlUrl);

if (isParseAll) {
  parseStarkScan(null, null, database, proxy, slowMode, graphlUrl);
}

if (is30mNewInsert) {
  cache.startUpdateOnInterval(1800);
}

if (isHourlyUpdate) {
  hourlyContractsUpdate(21600, database, proxy, graphlUrl);
}

app.use(express.static(path.resolve("../client/build")));

app.use(express.json({limit: "1mb"}));

app.use(express.urlencoded());

app.get("/api/tx", async (req, res) => {
  let data = cache.getCacheTx();
  if (data.data === undefined) {
    res.status(500).json(data);
  } else {
    res.json(data);
  }
});

app.get("/api/balance", async (req, res) => {
  let data = cache.getCacheBalance();
  if (data.data === undefined) {
    res.status(500).json(data);
  } else {
    res.json(data);
  }
});

app.get("/api/activity", async (req, res) => {
  let data = cache.getCacheActivity();
  if (data.data === undefined) {
    res.status(500).json(data);
  } else {
    res.json(data);
  }
});

app.get("/api/total", async (req, res) => {
  let data = cache.getTotalWallets();
  if (data.data === undefined) {
    res.status(500).json(data);
  } else {
    res.json(data);
  }
});

app.post("/api/batchcheck", async (req, res) => {
  let { data } = req.body;
  if (data === undefined) {
    res.status(500).json({status: false, error: "Вы не отправили данные."});
  } else {
    try {
      let validated = [];
      for (let address of data) {
        try {
          validated.push(getChecksumAddress(address).toLowerCase());
        } catch (e) {
          res.status(500).json({status: false, error: `Адрес ${address} имеет неправильный формат.`});
          return;
        }
      }
      let filter = { contract: { $in: validated } };
      let mapFilter = new Map<string, number>();
      for (let i = 0; i < validated.length; i++) {
        mapFilter.set(validated[i], i);
      }
      let result = (await database.readFilteredContracts(filter)).map((v) => {
        let days = cache.activeCount([v.txTimestamps], 86400);
        let weeks = cache.activeCount([v.txTimestamps], 604800);
        let months = cache.activeCount([v.txTimestamps], 2592000);
        return { contract: v.contract, nonce: v.nonce, balance: v.balance, txTimestamps: `${days.length > 0 ? days : 0} / ${weeks.length > 0 ? weeks : 0} / ${months.length > 0 ? months : 0}`, index: mapFilter.has(v.contract) ? mapFilter.get(v.contract) as number : 0 }
      }).sort((a, b) => a.index - b.index);
      res.json({ data: result });
    } catch (e) {
      res.status(500).json({status: false, error: "Ошибка в ходе запроса к базе данных."});
    }
  }
});

app.get("*", (req, res) => {
  res.sendFile(path.resolve("../client/build/index.html"))
}
);

app.listen(port, () => {
  console.log(`Listening on port ${port}..`);
});
