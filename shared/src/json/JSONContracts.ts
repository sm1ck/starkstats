export interface JSONContracts {
  data: Data;
}

export interface Data {
  deploy?: Deploy[];
  deploy_account?: DeployAccount[];
}

export interface Deploy {
  contract: Contract;
  time: Date;
}

export interface DeployAccount {
  contract: Contract;
  time: Date;
}

export interface Contract {
  hash: string;
  class_id: number;
}

export const isJSONContracts = (json: unknown): json is JSONContracts =>
  (json as JSONContracts)?.data !== undefined;

export const isDeploy = (json: unknown): json is Deploy[] =>
  (json as Deploy[])?.length !== undefined;

export const isDeployAccounts = (json: unknown): json is DeployAccount[] =>
  (json as DeployAccount[])?.length !== undefined;
