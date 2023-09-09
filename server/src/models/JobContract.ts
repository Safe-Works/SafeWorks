type JobContract = {
    uid: string,
    advertisement: any, // dados do anuncio que o trabalho pertence
    worker: any, // dados do trabalhador que o contrato pertence
    client: any, // dados do cliente que o contrato pertence
    price: number, // preço total do serviço contratado
    paid: boolean, // se o pagamento já foi realizado
    worker_rating?: number, // avaliação do trabalhador do contrato
    client_rating?: number, // avaliação do cliente do contrato
    canceled: boolean, // se o serviço foi cancelado antes de finalizado
    created: Date,
    modified?: Date,
    deleted?: Date
}