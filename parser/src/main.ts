import { Database } from "shared";
import parseDeploy from "./services/parseDeploy";
import hourlyContractsUpdate from "./services/hourlyContractsUpdate";
import addNewContracts from "./services/addNewContracts";

const slowMode = process.env.SLOW_MODE === "true" ? true : false;
const isParseAll = process.env.PARSE_ALL_CONTRACTS === "true" ? true : false;
const is30mNewInsert =
  process.env.NEW_INSERT_CONTRACTS === "true" ? true : false;
const isHourlyUpdate = process.env.UPDATE_CONTRACTS === "true" ? true : false;
const graphlUrl = process.env.GRAPHQL_URL || "";
const database = new Database(
  process.env.MONGODB_URL || "mongodb://root:pass@127.0.0.1:27017",
);

if (isParseAll) {
  parseDeploy(null, null, database, "deploy", slowMode, graphlUrl);
  parseDeploy(null, null, database, "deploy_account", slowMode, graphlUrl);
}

if (is30mNewInsert) {
  addNewContracts(1800, database, graphlUrl);
}

if (isHourlyUpdate) {
  hourlyContractsUpdate(5, database, graphlUrl); // 6 hrs for work update, 5 secs sleep
}
