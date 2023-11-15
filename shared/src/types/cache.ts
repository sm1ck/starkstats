export interface Status {
  status: boolean;
  error: string;
}

export const isStatus = (object: unknown): object is Status =>
  (object as Status)?.status !== undefined;

export interface Volume {
  data: VolumeData;
}

export interface VolumeData {
  bridgesVolume: VolumeDataFields;
  bridgesWithCexVolume: VolumeDataFields;
}

export interface VolumeDataFields {
  lessThan5of1000: number;
  lessThan1of100: number;
  lessThan1of10: number;
  lessThan1of2: number;
  lessThan1: number;
}

export const isVolume = (object: unknown): object is Volume =>
  (object as Volume)?.data !== undefined;

export const isVolumeDataFields = (
  object: unknown,
): object is VolumeDataFields =>
  (object as VolumeDataFields)?.lessThan1 !== undefined;

export interface InternalVolume {
  data: InternalVolumeData;
}

export interface InternalVolumeData {
  internal50: number;
  internal500: number;
  internal1000: number;
  internal5000: number;
  internal10000: number;
  internal50000: number;
  internalMore: number;
}

export const isInternalVolume = (object: unknown): object is InternalVolume =>
  (object as InternalVolume)?.data !== undefined;

export const isInternalVolumeData = (
  object: unknown,
): object is InternalVolumeData =>
  (object as InternalVolumeData)?.internal50 !== undefined;

export interface Tx {
  data: TxData;
}

export interface TxData {
  users_by_tx: TxDataFields;
}

export interface TxDataFields {
  1: number;
  5: number;
  10: number;
  20: number;
  30: number;
  50: number;
}

export const isTx = (object: unknown): object is Tx =>
  (object as Tx)?.data !== undefined;

export const isTxDataFields = (object: unknown): object is TxDataFields =>
  (object as TxDataFields)?.[1] !== undefined;

export interface Balance {
  data: BalanceData;
}

export interface BalanceData {
  lessThan5of1000: number;
  lessThan1of100: number;
  lessThan1of10: number;
  lessThan1of2: number;
  lessThan1: number;
}

export const isBalance = (object: unknown): object is Balance =>
  (object as Balance)?.data !== undefined;

export const isBalanceData = (object: unknown): object is BalanceData =>
  (object as BalanceData)?.lessThan1 !== undefined;

export interface Activity {
  data: ActivityData;
}

export interface ActivityData {
  users_by_days: ActivityDataDaysFields;
  users_by_weeks: ActivityDataWeeksMonthsFields;
  users_by_months: ActivityDataWeeksMonthsFields;
}

export interface ActivityDataDaysFields {
  1: number;
  2: number;
  3: number;
  4: number;
  5: number;
  10: number;
  20: number;
  30: number;
  all: number;
}

export interface ActivityDataWeeksMonthsFields {
  1: number;
  2: number;
  3: number;
  4: number;
  5: number;
  all: number;
}

export const isActivity = (object: unknown): object is Activity =>
  (object as Activity)?.data !== undefined;

export const isActivityDataDaysFields = (
  object: unknown,
): object is ActivityDataDaysFields =>
  (object as ActivityDataDaysFields)?.[1] !== undefined;

export const isActivityDataWeeksMonthsFields = (
  object: unknown,
): object is ActivityDataWeeksMonthsFields =>
  (object as ActivityDataWeeksMonthsFields)?.[1] !== undefined;

export interface TotalWallets {
  data: TotalWalletsData;
}

export interface TotalWalletsData {
  totalWallets: number;
  totalWalletsFiltered: number;
}

export const isTotalWallets = (object: unknown): object is TotalWallets =>
  (object as TotalWallets)?.data !== undefined;

export const isTotalWalletsData = (
  object: unknown,
): object is TotalWalletsData =>
  (object as TotalWalletsData)?.totalWallets !== undefined;

export interface SingleChartDot {
  label: string;
  x: number;
  y: number;
}

export interface AggregateData {
  data: Array<SingleChartDot>;
}
