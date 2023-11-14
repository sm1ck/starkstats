export interface Status {
  status: boolean;
  error: string;
}

export const isStatus = (object: unknown): object is Status =>
  (object as Status)?.status !== undefined;

export interface Volume {
  data: {
    bridgesVolume: {
      lessThan5of1000: number;
      lessThan1of100: number;
      lessThan1of10: number;
      lessThan1of2: number;
      lessThan1: number;
    };
    bridgesWithCexVolume: {
      lessThan5of1000: number;
      lessThan1of100: number;
      lessThan1of10: number;
      lessThan1of2: number;
      lessThan1: number;
    };
  };
}

export const isVolume = (object: unknown): object is Volume =>
  (object as Volume)?.data !== undefined;

export interface InternalVolume {
  data: {
    internal50: number;
    internal500: number;
    internal1000: number;
    internal5000: number;
    internal10000: number;
    internal50000: number;
    internalMore: number;
  };
}

export const isInternalVolume = (object: unknown): object is InternalVolume =>
  (object as InternalVolume)?.data !== undefined;

export interface Tx {
  data: {
    users_by_tx: {
      1: number;
      5: number;
      10: number;
      20: number;
      30: number;
      50: number;
    };
  };
}

export const isTx = (object: unknown): object is Tx =>
  (object as Tx)?.data !== undefined;

export interface Balance {
  data: {
    lessThan5of1000: number;
    lessThan1of100: number;
    lessThan1of10: number;
    lessThan1of2: number;
    lessThan1: number;
  };
}

export const isBalance = (object: unknown): object is Balance =>
  (object as Balance)?.data !== undefined;

export interface Activity {
  data: {
    users_by_days: {
      1: number;
      2: number;
      3: number;
      4: number;
      5: number;
      10: number;
      20: number;
      30: number;
      all: number;
    };
    users_by_weeks: {
      1: number;
      2: number;
      3: number;
      4: number;
      5: number;
      all: number;
    };
    users_by_months: {
      1: number;
      2: number;
      3: number;
      4: number;
      5: number;
      all: number;
    };
  };
}

export const isActivity = (object: unknown): object is Activity =>
  (object as Activity)?.data !== undefined;

export interface TotalWallets {
  data: {
    totalWallets: number;
    totalWalletsFiltered: number;
  };
}

export const isTotalWallets = (object: unknown): object is TotalWallets =>
  (object as TotalWallets)?.data !== undefined;

export interface SingleChartDot {
  label: string;
  x: number;
  y: number;
}

export interface AggregateData {
  data: Array<SingleChartDot>;
}
