import mongoose, { Document, Types } from "mongoose";
import Database from "../database/Database";
import { IContract } from "../database/models/Contract";
declare const parseSingleContract: (doc: mongoose.HydratedDocument<IContract>, database: Database, parseUrl: string, retries: number) => Promise<void | (Document<unknown, NonNullable<unknown>, IContract> & Omit<IContract & {
    _id: Types.ObjectId;
}, never>)>;
export default parseSingleContract;
