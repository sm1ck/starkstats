export const sumPercent = (data: any, objKey: string | number) => (data[objKey] / (Object.entries(data).map((v) => v[1]).reduce((sum: any, num: any) => sum + num) as number) * 100).toFixed(2);

export const sumPercentWithTotal = (data: number, total: number) => (data / total * 100).toFixed(2);

export const replaceRuEngDates = (str: string) => str.replace("д.", "d.").replace("ч.", "h.").replace("мин.", "min.");

export const smallColormap = ["rgb(148, 0, 49)", "rgb(196, 51, 67)", "rgb(220, 84, 41)", "rgb(255, 130, 29)", "rgb(255, 175, 85)"].reverse();

export const midColormap = ["rgb(123, 6, 35)", "rgb(159, 7, 43)", "rgb(196, 51, 67)", "rgb(220, 84, 41)", "rgb(255, 130, 29)", "rgb(255, 175, 85)"].reverse();

export const largeColorMap = ["rgb(123 6 35)", "rgb(159 7 43)", "rgb(200 6 46)", "rgb(196, 51, 67)", "rgb(220, 84, 41)", "rgb(255, 130, 29)", "rgb(255, 175, 85)"].reverse();