import Certification from "./Certification";

type Portfolio = {
    description: string,
    certifications?: Array<Certification>,
    years_experience: Int16Array
};

export default Portfolio;