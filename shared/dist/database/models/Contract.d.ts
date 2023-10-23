import mongoose from "mongoose";
export interface IContract {
    contract: string;
    nonce: number;
    balance: number;
    txTimestamps: number[];
    bridgesVolume: number;
    bridgesWithCexVolume: number;
    internalVolume: number;
    internalVolumeStables: number;
}
declare const Contract: mongoose.Model<IContract, {}, {}, {}, mongoose.Document<unknown, {}, IContract> & IContract & {
    _id: mongoose.Types.ObjectId;
}, mongoose.Schema<IContract, mongoose.Model<IContract, any, any, any, mongoose.Document<unknown, any, IContract> & IContract & {
    _id: mongoose.Types.ObjectId;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, IContract, mongoose.Document<unknown, {}, mongoose.FlatRecord<IContract>> & mongoose.FlatRecord<IContract> & {
    _id: mongoose.Types.ObjectId;
}>>;
export default Contract;
