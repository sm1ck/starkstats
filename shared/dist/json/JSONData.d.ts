import { JSONError } from "./JSONError";
export interface JSONData {
    data: Data;
}
export interface Data {
    invoke: Invoke[];
    transfer: Transfer[];
    deploy: Deploy[];
    deploy_account: DeployAccount[];
    token_balance: TokenBalance[];
}
export interface DeployAccount {
    time: Date;
}
export interface Deploy {
    time: Date;
}
export interface Invoke {
    time: Date;
    parsed_calldata: ParsedCalldata | null;
}
export interface ParsedCalldata {
    calldata?: string[];
    call_array?: CallArray[];
    calldata_len?: string;
    call_array_len?: string;
    calls?: Call[];
}
export interface CallArray {
    to: string;
    data_len: string;
    selector: string;
    data_offset: string;
}
export interface Call {
    to: string;
    calldata: string[];
    selector: string;
}
export interface TokenBalance {
    balance: number;
}
export interface Transfer {
    from: From;
    to: From;
    token: Token;
    amount: number;
}
export interface From {
    hash: string;
}
export interface Token {
    contract: From;
}
export type JSONDataOrError = JSONError | JSONData;
export declare const isJSONData: (json: unknown) => json is JSONData;
export declare const isParsedCalldataContainsCalls: (calls: unknown) => calls is Call[];
export declare const isParsedCalldataContainsCallArrays: (calls: unknown) => calls is CallArray[];
export declare const isCall: (call: unknown) => call is Call;
