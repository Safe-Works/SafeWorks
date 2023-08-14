/*
interface Certification {
    id?: string,
    title?: string,
    description?: string,
    issue_organization?: string,
    issue_date?: Date,
    certification_url?: string
}
*/

class Certification {
    constructor(
       public id?: string,
       public title?: string,
       public description?: string,
       public issue_organization?: string,
       public issue_date?: Date,
       public certification_url?: string
    ) {

    }
}

export default Certification;
  