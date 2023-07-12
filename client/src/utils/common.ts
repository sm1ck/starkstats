export const sumPercent = (data: any, objKey: string | number) => (data[objKey] / (Object.entries(data).map((v) => v[1]).reduce((sum: any, num: any) => sum + num) as number) * 100).toFixed(2);

export const sumPercentWithTotal = (data: number, total: number) => (data / total * 100).toFixed(2);