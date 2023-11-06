import { parentPort, workerData } from "worker_threads";
import { exit } from "process";

interface JSONAggregateTx {
  data: Data;
}

interface Data {
  deploy_account_aggregate: Aggregate;
  deploy_aggregate: Aggregate;
  declare_aggregate: Aggregate;
  invoke_aggregate: Aggregate;
  l1_handler_aggregate: Aggregate;
}

interface JSONAggregateUsers {
  data: DataUsers;
}

interface DataUsers {
  deploy_account_aggregate: Aggregate;
  deploy_aggregate: Aggregate;
}

interface Aggregate {
  aggregate: AggregateClass;
}

interface AggregateClass {
  count: number;
}

const isJSONAggregateTx = (json: unknown): json is JSONAggregateTx =>
  (json as JSONAggregateTx)?.data !== undefined;

const isJSONAggregateUsers = (json: unknown): json is JSONAggregateUsers =>
  (json as JSONAggregateUsers)?.data !== undefined;

interface SendMonth {
  label: string;
  x: number;
  y: number;
}

interface SendData {
  data: Array<SendMonth>;
}

try {
  let { parseUrl } = workerData;
  let sendData: SendData = {
    data: [],
  };
  let startBlockchainDate = new Date(2021, 9, 1); // 1 october 2021 for 0 point
  let x = 0,
    y = 0;
  while (startBlockchainDate.getTime() < Date.now()) {
    let year = startBlockchainDate.getUTCFullYear();
    let month = startBlockchainDate.getUTCMonth();
    if (month >= 11) {
      month = 0;
      year++;
    } else {
      month++;
    }
    let nextBlockchainDate = new Date(year, month, 1);
    let timestampzGte = startBlockchainDate.toISOString();
    let timestampzLt = nextBlockchainDate.toISOString();

    let parse = await fetch(parseUrl, {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        query: `query MyQuery { deploy_account_aggregate(where: {_and: [{time: {_gte: "${timestampzGte}"}}, {time: {_lt: "${timestampzLt}"}}]}) { aggregate { count(columns: id) } } deploy_aggregate(where: {_and: [{time: {_gte: "${timestampzGte}"}}, {time: {_lt: "${timestampzLt}"}}]}) { aggregate { count(columns: id) } } declare_aggregate(where: {_and: [{time: {_gte: "${timestampzGte}"}}, {time: {_lt: "${timestampzLt}"}}]}) { aggregate { count(columns: id) } } invoke_aggregate(where: {_and: [{time: {_gte: "${timestampzGte}"}}, {time: {_lt: "${timestampzLt}"}}]}) { aggregate { count(columns: id) } } l1_handler_aggregate(where: {_and: [{time: {_gte: "${timestampzGte}"}}, {time: {_lt: "${timestampzLt}"}}]}) { aggregate { count(columns: id) } } }`,
      }),
    });
    let json = (await parse.json()) as JSONAggregateTx;
    if (!isJSONAggregateTx(json)) {
      console.log(
        `[Error] -> JSON не является аггрегированной статистикой по транзакциям (gte: ${timestampzGte}, lt: ${timestampzLt}):`,
      );
      console.dir(json);
      exit(0);
    }
    y +=
      json.data.declare_aggregate.aggregate.count +
      json.data.deploy_account_aggregate.aggregate.count +
      json.data.deploy_aggregate.aggregate.count +
      json.data.invoke_aggregate.aggregate.count +
      json.data.l1_handler_aggregate.aggregate.count;
    sendData.data.push({ label: `${year} ${month}`, x, y });

    startBlockchainDate = nextBlockchainDate;
    x++;
  }
  if (sendData.data.length > 0) {
    let currDate = new Date();
    sendData.data[
      sendData.data.length - 1
    ].label = `${currDate.getUTCFullYear()} ${currDate.getUTCMonth()} ${currDate.getUTCDate()}`;
  }
  if (parentPort) {
    parentPort.postMessage({ tx: sendData });
  }

  let sendDataUsers: SendData = {
    data: [],
  };
  startBlockchainDate = new Date(2021, 9, 1); // 1 october 2021 for 0 point
  (x = 0), (y = 0);
  const accountIds = [19, 62, 69, 78, 4790, 4410, 404, 4808, 9614];
  let andUsers = accountIds.map((v) => `{ class_id: {_eq: ${v}} }`);
  while (startBlockchainDate.getTime() < Date.now()) {
    let year = startBlockchainDate.getUTCFullYear();
    let month = startBlockchainDate.getUTCMonth();
    if (month >= 11) {
      month = 0;
      year++;
    } else {
      month++;
    }
    let nextBlockchainDate = new Date(year, month, 1);
    let timestampzGte = startBlockchainDate.toISOString();
    let timestampzLt = nextBlockchainDate.toISOString();

    let parse = await fetch(parseUrl, {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        query: `query MyQuery { deploy_account_aggregate(where: {_and: [{time: {_gte: "${timestampzGte}"}}, {time: {_lt: "${timestampzLt}"}}, {_or: [${andUsers.join(
          ",",
        )}]} ]}) { aggregate { count(columns: id) } } deploy_aggregate(where: {_and: [{time: {_gte: "${timestampzGte}"}}, {time: {_lt: "${timestampzLt}"}}, {_or: [${andUsers.join(
          ",",
        )}]} ]}) { aggregate { count(columns: id) } } }`,
      }),
    });
    let json = (await parse.json()) as JSONAggregateUsers;
    if (!isJSONAggregateUsers(json)) {
      console.log(
        `[Error] -> JSON не является аггрегированной статистикой по пользователям (gte: ${timestampzGte}, lt: ${timestampzLt}):`,
      );
      console.dir(json);
      exit(0);
    }
    y +=
      json.data.deploy_account_aggregate.aggregate.count +
      json.data.deploy_aggregate.aggregate.count;
    sendDataUsers.data.push({ label: `${year} ${month}`, x, y });

    startBlockchainDate = nextBlockchainDate;
    x++;
  }
  if (sendDataUsers.data.length > 0) {
    let currDate = new Date();
    sendDataUsers.data[
      sendDataUsers.data.length - 1
    ].label = `${currDate.getUTCFullYear()} ${currDate.getUTCMonth()} ${currDate.getUTCDate()}`;
  }
  if (parentPort) {
    parentPort.postMessage({ users: sendDataUsers });
  }
} catch (e) {
  console.log("[Error] -> ", e);
}
exit(0);
