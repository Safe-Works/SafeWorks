import Portfolio from "./Portfolio";

type Worker = {
    area: string,
    services_done?: Array<string>, // total de serviços realizados
    portfolio?: Portfolio
};

export default Worker;