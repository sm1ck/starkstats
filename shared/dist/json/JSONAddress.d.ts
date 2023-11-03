import { JSONError } from "./JSONError";
export interface JSONAddress {
    data: Data;
}
export interface Data {
    address: Address[];
}
export interface Address {
    id: number;
}
export type JSONAddressOrError = JSONError | JSONAddress;
export declare const isJSONAddress: (json: unknown) => json is JSONAddress;
