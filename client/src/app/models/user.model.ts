class User {
    constructor(
      public email: string,
      public password: string,
      public name: string,
      public cpf: string,
      public telephone_number: string,
      public uid?: string,
      public token?: string,
    ) {}
  }
  
export default User;
  