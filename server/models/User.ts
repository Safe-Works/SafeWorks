import Worker from "./Worker";

type User = {
    uid?: string,
    accessToken?: string,
    email: string,
    password: string,
    name: string,
    username: string,
    cpf: string,
    telephone_number: string,
    address?: string,
    rating_mean?: Float32Array,
    total_ratings?: Int16Array,
    balance?: Float32Array, // payment balance
    contracted_services?: Array<string>, // client total contracted services
    worker?: Worker
};

export default User;