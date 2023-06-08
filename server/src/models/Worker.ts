import Portfolio from "./Portfolio";

type Worker = {
    area: Array<string>,
    services_done?: Array<string>, // total de serviços realizados
    portfolio?: Portfolio
};

export default Worker;