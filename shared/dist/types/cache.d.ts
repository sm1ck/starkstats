export interface Status {
    status: boolean;
    error: string;
}
export declare const isStatus: (object: unknown) => object is Status;
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
export declare const isVolume: (object: unknown) => object is Volume;
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
export declare const isInternalVolume: (object: unknown) => object is InternalVolume;
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
export declare const isTx: (object: unknown) => object is Tx;
export interface Balance {
    data: {
        lessThan5of1000: number;
        lessThan1of100: number;
        lessThan1of10: number;
        lessThan1of2: number;
        lessThan1: number;
    };
}
export declare const isBalance: (object: unknown) => object is Balance;
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
export declare const isActivity: (object: unknown) => object is Activity;
export interface TotalWallets {
    data: {
        totalWallets: number;
        totalWalletsFiltered: number;
    };
}
export declare const isTotalWallets: (object: unknown) => object is TotalWallets;
export interface SingleChartDot {
    label: string;
    x: number;
    y: number;
}
export interface AggregateData {
    data: Array<SingleChartDot>;
}
