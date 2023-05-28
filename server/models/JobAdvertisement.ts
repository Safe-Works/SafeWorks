type JobAdvertisement = {
    uid: string
    worker: Array<string>,
    title: string,
    description: string,
    category: string,
    address: string, // endereço onde o serviço será realizado
    price: Float32Array, // preço base de orçamento do serviço
    price_type: string, // medida de preço do serviço (m2, horas, etc)
    displacement_fee: Float32Array, // taxa de deslocamento
    delivery_type: string, // tipo de entrega do serviço
    media?: Array<string> // lista com url das midias do anuncio
    contracts?: Array<string> // lista com os uids de contratos de um anuncio
    expired: boolean,
    created: Date,
    modified?: Date,
    deleted?: Date,
}