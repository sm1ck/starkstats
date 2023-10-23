export const sleep: (millis: number) => Promise<void> = async (millis) =>
  new Promise((resolve) => setTimeout(resolve, millis));

export const randomIntInRange: (min: number, max: number) => number = (
  min,
  max
) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const countTime = (seconds: number, isAddSeconds: boolean) => {
  let days = Math.floor(seconds / (3600 * 24));
  seconds -= days * 3600 * 24;
  let hrs = Math.floor(seconds / 3600);
  seconds -= hrs * 3600;
  let mnts = Math.floor(seconds / 60);
  seconds -= mnts * 60;
  return `${days > 0 ? `${days} д. ` : ""}${hrs > 0 ? `${hrs} ч. ` : ""}${
    mnts > 0 ? `${mnts} мин. ` : ""
  }${isAddSeconds && seconds > 0 ? `${seconds} с. ` : ""}`;
};

interface ParseObject {
  [index: string]: any;
}

export const deepMergeSum = (obj1: ParseObject, obj2: ParseObject) => {
  return Object.keys(obj1).reduce((acc, key) => {
    if (typeof obj2[key] === "object") {
      acc[key] = deepMergeSum(obj1[key], obj2[key]);
    } else if (obj2.hasOwnProperty(key) && !isNaN(parseFloat(obj2[key]))) {
      acc[key] = obj1[key] + obj2[key];
    }
    return acc;
  }, {} as ParseObject);
};
