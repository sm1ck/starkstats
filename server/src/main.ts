import express from "express";
import { getChecksumAddress } from "starknet";
import path from "path";
import Database from "./database/Database";
import Cache from "./database/Cache";
import { countTime } from "./utils/common";

const app = express();
const port = 5000;
const is30mNewInsert = process.env.NEW_INSERT_CONTRACTS === "true" ? true : false;
const graphlUrl = process.env.GRAPHQL_URL || ""
const cores = process.env.CORES || 6
const database = new Database(
  process.env.MONGODB_URL || "mongodb://root:pass@127.0.0.1:27017"
);
const cache = new Cache(database, graphlUrl);

if (is30mNewInsert) {
  cache.startUpdateOnInterval(300, +cores);
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

app.get("/api/volume", async (req, res) => {
  let data = cache.getCacheVolume();
  if (data.data === undefined) {
    res.status(500).json(data);
  } else {
    res.json(data);
  }
});

app.get("/api/internalvolume", async (req, res) => {
  let data = cache.getCacheInternalVolume();
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
  let data = cache.getCacheTotalWallets();
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
        let lastTx = v.txTimestamps.length > 0 ? countTime((new Date().getTime() / 1000) - (v.txTimestamps.sort().at(-1) as number), false) : "";
        return { contract: v.contract, nonce: v.nonce, balance: v.balance, txTimestamps: `${days.length > 0 ? days : 0} / ${weeks.length > 0 ? weeks : 0} / ${months.length > 0 ? months : 0}`, lastTx, bridgesVolume: v.bridgesVolume, bridgesWithCexVolume: v.bridgesWithCexVolume, internalVolume: cache.getCacheEthPrice() * v.internalVolume + v.internalVolumeStables, index: mapFilter.has(v.contract) ? mapFilter.get(v.contract) as number : 0 }
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

app.listen(port, "localhost", () => {
  console.log(`Listening on port ${port}..`);
});
