import Certification from "./certification.model";

interface Portfolio {
    user_uid?: string,
    description?: string,
    years_experience?: number,
    certifications?: Array<Certification>,
    uid?: string
}

export default Portfolio;
  