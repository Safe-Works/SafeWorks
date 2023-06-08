type JobAdvertisement = {
    uid: string
    worker: any,
    title: string,
    description: string,
    category: any,
    address: any, // endereço onde o serviço será realizado
    price: number, // preço base de orçamento do serviço
    price_type: any, // medida de preço do serviço (m2, horas, etc)
    displacement_fee: number, // taxa de deslocamento
    delivery_type: any, // tipo de entrega do serviço
    media?: Array<string> // lista com url das midias do anuncio
    contracts?: Array<string> // lista com os uids de contratos de um anuncio
    expired?: boolean,
    created: Date,
    modified?: Date,
    deleted?: Date,
}
export default JobAdvertisement;