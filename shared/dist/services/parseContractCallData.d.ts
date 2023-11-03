import { ParsedCalldata } from "../json/JSONData";
interface Result {
    token: string;
    amount: number;
}
declare const parseContractCallData: (calldata: ParsedCalldata) => Result;
export default parseContractCallData;
