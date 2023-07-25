import Certification from "./Certification";

type Portfolio = {
    uid: string,
    user_uid: string,
    description: string,
    certifications?: Array<Certification>,
    years_experience: Int16Array,
    created: Date,
    modified: Date,
    deleted: Date
};

export default Portfolio;