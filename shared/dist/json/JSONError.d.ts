export interface JSONError {
    errors: Error[];
}
export interface Error {
    extensions: Extensions;
    message: string;
}
export interface Extensions {
    code: string;
    path: string;
}
export declare const isJSONError: (json: unknown) => json is JSONError;
