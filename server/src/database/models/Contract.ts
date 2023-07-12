import mongoose from "mongoose";

export interface IContract {
  contract: string;
  nonce: number;
  balance: number;
  txTimestamps: number[]
}

const schema = new mongoose.Schema<IContract>({
  contract: { type: String, unique: true, require: true },
  nonce: Number,
  balance: Number,
  txTimestamps: [Number],
});

const Contract = mongoose.model("Contract", schema);
export default Contract;
