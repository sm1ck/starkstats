import mongoose from "mongoose";

export interface IContract {
  contract: string;
  nonce: number;
  balance: number;
  txTimestamps: number[],
  bridgesVolume: number,
  bridgesWithCexVolume: number,
  bridgesVolumeStables: number,
  bridgesWithCexVolumeStables: number,
  internalVolume: number,
  internalVolumeStables: number,
}

const schema = new mongoose.Schema<IContract>({
  contract: { type: String, unique: true, require: true },
  nonce: Number,
  balance: Number,
  txTimestamps: [Number],
  bridgesVolume: Number,
  bridgesWithCexVolume: Number,
  bridgesVolumeStables: Number,
  bridgesWithCexVolumeStables: Number,
  internalVolume: Number,
  internalVolumeStables: Number,
});

const Contract = mongoose.model("Contract", schema);
export default Contract;
