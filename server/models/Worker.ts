import Portfolio from "./Portfolio";

type Worker = {
    description?: string,
    area: string,
    rating_mean?: Float32Array,
    total_ratings?: Int16Array,
    services_done?: Array<string>, // worker total completed services
    portfolio?: Portfolio
};

export default Worker;