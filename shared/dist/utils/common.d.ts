export declare const sleep: (millis: number) => Promise<void>;
export declare const randomIntInRange: (min: number, max: number) => number;
export declare const countTime: (seconds: number, isAddSeconds: boolean) => string;
export declare const convertToNormalAddress: (address: string) => string;
export declare const convertToGraphQlAddress: (address: string) => string;
export declare const formatBalance: (value: bigint, decimals: number) => number;
interface ParseObject {
    [index: string]: any;
}
export declare const deepMergeSum: (obj1: ParseObject, obj2: ParseObject) => ParseObject;
export {};
