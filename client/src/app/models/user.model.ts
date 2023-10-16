import Worker from "./worker.model";

class User {
    constructor(
      public email?: string,
      public password?: string,
      public name?: string,
      public cpf?: string,
      public telephone_number?: string,
      public uid?: string,
      public is_admin?: boolean,
      public username?: string,
      public district?: string,
      public token?: string,
      public contracted_services?: Array<{}>,
      public admin?: boolean,
      public worker?: Worker
    ) {}
  }
  
export default User;
  