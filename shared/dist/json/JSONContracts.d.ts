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
export declare const isJSONContracts: (json: unknown) => json is JSONContracts;
export declare const isDeploy: (json: unknown) => json is Deploy[];
export declare const isDeployAccounts: (json: unknown) => json is DeployAccount[];
