class JobAdvertisement {
  constructor(
    public user: string[],
    public title: string,
    public category: string,
    public price: number,
    public priceType: string, // Tipo de valor (Hora, metro, dias, quantidade)
    public location: string,
    public description: string,
    public id?: string,
    public media?: string[], // Lista de imagens do anúncio
    public deliveryTime?: string, // Tempo de entrega, se aplicável
    public createdAt?: Date,
    public updatedAt?: Date,
    public isExpired?: boolean,
    public isSold?: boolean,
    public displacementFee?: number, // Custo de deslocamento
  ) { }
}

export default JobAdvertisement;
