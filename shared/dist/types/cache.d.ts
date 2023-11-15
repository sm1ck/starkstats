export interface Status {
    status: boolean;
    error: string;
}
export declare const isStatus: (object: unknown) => object is Status;
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
export declare const isVolume: (object: unknown) => object is Volume;
export declare const isVolumeDataFields: (object: unknown) => object is VolumeDataFields;
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
export declare const isInternalVolume: (object: unknown) => object is InternalVolume;
export declare const isInternalVolumeData: (object: unknown) => object is InternalVolumeData;
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
export declare const isTx: (object: unknown) => object is Tx;
export declare const isTxDataFields: (object: unknown) => object is TxDataFields;
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
export declare const isBalance: (object: unknown) => object is Balance;
export declare const isBalanceData: (object: unknown) => object is BalanceData;
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
export declare const isActivity: (object: unknown) => object is Activity;
export declare const isActivityDataDaysFields: (object: unknown) => object is ActivityDataDaysFields;
export declare const isActivityDataWeeksMonthsFields: (object: unknown) => object is ActivityDataWeeksMonthsFields;
export interface TotalWallets {
    data: TotalWalletsData;
}
export interface TotalWalletsData {
    totalWallets: number;
    totalWalletsFiltered: number;
}
export declare const isTotalWallets: (object: unknown) => object is TotalWallets;
export declare const isTotalWalletsData: (object: unknown) => object is TotalWalletsData;
export interface SingleChartDot {
    label: string;
    x: number;
    y: number;
}
export interface AggregateData {
    data: Array<SingleChartDot>;
}
