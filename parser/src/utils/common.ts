export const sleep: (millis: number) => Promise<void> = async (millis) =>
  new Promise((resolve) => setTimeout(resolve, millis));

export const randomIntInRange: (min: number, max: number) => number = (
  min,
  max
) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const countTime = (seconds: number, isAddSeconds: boolean) => {
  let days = Math.floor(seconds / (3600*24));
  seconds -= days*3600*24;
  let hrs = Math.floor(seconds / 3600);
  seconds -= hrs*3600;
  let mnts = Math.floor(seconds / 60);
  seconds -= mnts*60;
  return `${days > 0 ? `${days} д. ` : ""}${hrs > 0 ? `${hrs} ч. ` : ""}${mnts > 0 ? `${mnts} мин. ` : ""}${isAddSeconds && seconds > 0 ? `${seconds} с. ` : ""}`;
};

export const convertToNormalAddress = (address: string) => `0${address.slice(1)}`.toLowerCase();

export const convertToGraphQlAddress = (address: string) => `\\\\${address.slice(1)}`;

export const formatBalance = (qty: bigint, decimals: number): number => {
  let balance = String("0").repeat(decimals) + qty.toString();
  let rightCleaned = balance.slice(-decimals).replace(/(\d)0+$/gm, '$1');
  let leftCleaned = BigInt(balance.slice(0, balance.length - decimals)).toString();
  return +(leftCleaned + "." + rightCleaned);
}