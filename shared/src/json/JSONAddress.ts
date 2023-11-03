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

export const isJSONAddress = (json: unknown): json is JSONAddress =>
  (json as JSONAddress).data !== undefined;
