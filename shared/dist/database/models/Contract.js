import mongoose from "mongoose";
const schema = new mongoose.Schema({
    contract: { type: String, unique: true, require: true },
    nonce: Number,
    balance: Number,
    txTimestamps: [Number],
    bridgesVolume: Number,
    bridgesWithCexVolume: Number,
    internalVolume: Number,
    internalVolumeStables: Number,
});
const Contract = mongoose.model("Contract", schema);
export default Contract;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ29udHJhY3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvZGF0YWJhc2UvbW9kZWxzL0NvbnRyYWN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sUUFBUSxNQUFNLFVBQVUsQ0FBQztBQWFoQyxNQUFNLE1BQU0sR0FBRyxJQUFJLFFBQVEsQ0FBQyxNQUFNLENBQVk7SUFDNUMsUUFBUSxFQUFFLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUU7SUFDdkQsS0FBSyxFQUFFLE1BQU07SUFDYixPQUFPLEVBQUUsTUFBTTtJQUNmLFlBQVksRUFBRSxDQUFDLE1BQU0sQ0FBQztJQUN0QixhQUFhLEVBQUUsTUFBTTtJQUNyQixvQkFBb0IsRUFBRSxNQUFNO0lBQzVCLGNBQWMsRUFBRSxNQUFNO0lBQ3RCLHFCQUFxQixFQUFFLE1BQU07Q0FDOUIsQ0FBQyxDQUFDO0FBRUgsTUFBTSxRQUFRLEdBQUcsUUFBUSxDQUFDLEtBQUssQ0FBQyxVQUFVLEVBQUUsTUFBTSxDQUFDLENBQUM7QUFDcEQsZUFBZSxRQUFRLENBQUMifQ==