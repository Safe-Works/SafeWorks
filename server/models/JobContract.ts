type JobContract = {
    uid: string,
    advertisement: Array<string>, // dados do anuncio que o trabalho pertence
    worker: Array<string>, // dados do trabalhador que o contrato pertence
    client: Array<string>, // dados do cliente que o contrato pertence
    contract_price: Float32Array, // preço total do serviço contratado
    payed: boolean, // se o pagamento já foi realizado
    worker_rating?: Int16Array, // avaliação do trabalhador do contrato
    client_rating?: Int16Array, // avaliação do cliente do contrato
    canceled: boolean, // se o serviço foi cancelado antes de finalizado
    created: Date,
    modified?: Date,
    deleted?: Date
}