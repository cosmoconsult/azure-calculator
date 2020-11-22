import { Api } from "./api.ts";
import { IPriceRequest } from "./types.d.ts";
import {
    parse
} from "./deps.ts"
import { Result, ResultResource } from "./classes.ts";

if (import.meta.main) {
    const { args } = Deno;
    const parsedArgs = parse(args);
    console.log(parsedArgs.config);
    const config = await Deno.readTextFile(parsedArgs.config)
    const priceRequest: IPriceRequest = JSON.parse(config);

    var results: Result[] = [];

    for (let priceConfig of priceRequest.priceConfigs) {
        const ApiClient: Api = new Api(priceConfig.armRegionName, priceConfig.priceType, priceConfig.reservationTerm);

        for (let resourceConfig of priceRequest.resourceConfigs) {
            var result = new Result(`${resourceConfig.description} ${priceConfig.description} (${priceConfig.armRegionName} - ${priceConfig.priceType}${priceConfig.reservationTerm !== undefined ? ` ${priceConfig.reservationTerm}` : ''})`, [], 0, 0);

            for (let resource of resourceConfig.resources) {
                let price = await ApiClient.getPrice(resource);
                if (price !== undefined) {
                    let fullPrice = price.retailPrice * resource.amount * priceRequest.exchangeRate;
                    if (price.reservationTerm === '1 Year')
                        fullPrice = fullPrice / 12;
                    else if (price.reservationTerm === '3 Years')
                        fullPrice = fullPrice / 36;
                    else if (price.unitOfMeasure === '1 Hour')
                        fullPrice = fullPrice * priceRequest.hourFactor;
                    result.resultResources.push(new ResultResource(`${resource.description} (${resource.productName} - ${resource.amount} ${price.skuName})`, fullPrice, resource.optional));
                    result.totalIncludingOptional += fullPrice;
                    if (!resource.optional) {
                        result.totalExcludingOptional += fullPrice;
                    }
                }
            };
            results.push(result);
        };
    };

    let targetFile = `${parsedArgs.config.substring(0, parsedArgs.config.lastIndexOf("."))}-result.json`
    Deno.writeTextFileSync(targetFile, JSON.stringify(results))
    console.info('Done');
}