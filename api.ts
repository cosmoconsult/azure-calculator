import { IPrice, IPriceList, IResource } from "./types.d.ts"

export class Api {
    readonly #baseURL: string = "https://prices.azure.com/api/retail/prices";
    readonly #armRegionName: string;
    readonly #priceType: string;
    readonly #reservationTerm: string;

    constructor(armRegionName: string, priceType: string, reservationTerm: string) {
        this.#armRegionName = armRegionName;
        this.#priceType = priceType;
        this.#reservationTerm = reservationTerm;
    }

    getPrice = async (resource: IResource): Promise<IPrice | undefined> => {
        let url = "";
        try {
            let priceType = this.#priceType;
            let armRegionName = this.#armRegionName;
            let reservationTerm = this.#reservationTerm;

            if (resource.priceType !== undefined)
                priceType = resource.priceType;
            if (resource.armRegionName !== undefined)
                armRegionName = resource.armRegionName;
            if (resource.reservationTerm !== undefined)
                reservationTerm = resource.reservationTerm;

            url = `${this.#baseURL}?$filter=productName eq '${resource.productName}' and skuName eq '${resource.skuName}' and priceType eq '${priceType}' and armRegionName eq '${armRegionName}'`;

            if (priceType === "Reservation" && reservationTerm !== undefined && reservationTerm !== '') {
                url += ` and reservationTerm eq '${reservationTerm}'`;
            }
            if (resource.meterName !== undefined && resource.meterName !== '') {
                url += ` and meterName eq '${resource.meterName}'`;
            }
            const rawResult = await fetch(url);
            const result = await rawResult.json();
            if (result.status !== undefined && result.status !== 200) {
                console.error("Error fetching data: ");
                console.error(url);
                console.error(result);
                return undefined;
            }
            const priceList: IPriceList = result;
            if (priceList.Items?.length != 1) {
                console.error("Didn't get exactly 1 result as expected: ");
                console.error(url);
                console.error(priceList);
                return undefined;
            }
            return priceList.Items[0];
        } catch (error) {
            console.error("Error fetching data: ");
            console.error(url);
            console.error(error);
            return undefined;
        }
    }
}