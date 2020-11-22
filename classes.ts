export class Result {
    constructor(
        public description: string,
        public resultResources: ResultResource[],
        public totalExcludingOptional: number,
        public totalIncludingOptional: number) { }
}

export class ResultResource {
    constructor(
        public description: string,
        public monthlyPrice: number,
        public optional: boolean = false) { }
}