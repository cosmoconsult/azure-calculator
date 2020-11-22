export interface IPriceRequest {
    hourFactor: number;
    exchangeRate: number; //https://azureprice.net/Exchange
    resourceConfigs: IResourceConfig[];
    priceConfigs: IPriceConfig[];
}

export interface IPriceConfig {
    priceType: string;
    reservationTerm: string;
    armRegionName: string;
    description: string;
}

export interface IResourceConfig {
    description: string;
    resources: IResource[];
}

export interface IResource {
    productName: string;
    skuName: string;
    amount: number;
    meterName: string;
    priceType: string;
    reservationTerm: string;
    armRegionName: string;
    optional: boolean;
    description: string;
}

export interface IPriceList {
    BillingCurrency: BillingCurrency;
    CustomerEntityId: string;
    CustomerEntityType: string;
    Items: IPrice[];
    NextPageLink: string;
    Count: number;
}

export enum BillingCurrency {
    Usd = "USD",
}

export interface IPrice {
    currencyCode: BillingCurrency;
    tierMinimumUnits: number;
    retailPrice: number;
    unitPrice: number;
    armRegionName: string;
    location: string;
    effectiveStartDate: string;
    meterId: string;
    meterName: string;
    productId: string;
    skuId: string;
    productName: string;
    skuName: string;
    serviceName: string;
    serviceId: string;
    serviceFamily: string;
    unitOfMeasure: string;
    type: string;
    isPrimaryMeterRegion: boolean;
    armSkuName: string;
    reservationTerm?: string;
}
