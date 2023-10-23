interface Result {
    token: string;
    amount: number;
}
declare const parseContractCallData: (calldata: any) => Result;
export default parseContractCallData;
