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

export const isJSONError = (json: unknown): json is JSONError =>
  (json as JSONError).errors !== undefined;
