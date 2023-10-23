import mongoose, { FilterQuery } from "mongoose";
import Contract, { IContract } from "./models/Contract";
declare class Database {
    url: string;
    filterOutdated: {
        $and: ({
            nonce: {
                $ne: number;
            };
            $and?: undefined;
        } | {
            $and: ({
                nonce: {
                    $ne: number;
                };
                balance?: undefined;
            } | {
                balance: {
                    $ne: number;
                };
                nonce?: undefined;
            })[];
            nonce?: undefined;
        })[];
    };
    constructor(url: string);
    connect(): Promise<void>;
    writeContracts(contracts: Array<typeof Contract>): Promise<void>;
    updateContract(doc: mongoose.HydratedDocument<IContract>): Promise<void>;
    deleteContract(doc: mongoose.HydratedDocument<IContract>): Promise<void>;
    readContracts(): Promise<(mongoose.Document<unknown, {}, IContract> & IContract & {
        _id: mongoose.Types.ObjectId;
    })[]>;
    readFilteredContracts(filter: FilterQuery<IContract>, limit?: number, skip?: number): Promise<(mongoose.Document<unknown, {}, IContract> & IContract & {
        _id: mongoose.Types.ObjectId;
    })[]>;
}
export default Database;
