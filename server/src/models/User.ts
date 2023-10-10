import Worker from "./Worker";
import Favorites from "./Favorites";

type User = {
    uid?: string,
    email: string,
    password: string,
    name: string,
    username?: string,
    cpf: string,
    telephone_number: string,
    district?: string,
    photo_url?: string,
    balance?: Float32Array, // saldo de pagamento
    contracted_services?: Array<string>, // uids dos serviços contratados pelo cliente
    admin: boolean,
    worker?: Worker,
    created: Date,
    modified?: Date,
    deleted?: Date,
    accessToken?: string, // token jwt
    Favorites?: Favorites,
};

export default User;