class JobAdvertisement {
  constructor(
    public user: any,
    public title: string,
    public description: string,
    public category: string,
    public location: string,
    public price: number,
    public price_type: string, // Tipo de valor (Hora, metro, dias, quantidade)
    public displacement_fee?: number, // Custo de deslocamento
    public uid?: string,
    public delivery_time?: string, // Tempo de entrega, se aplicável
    public media?: string[], // Lista de imagens do anúncio
    public created_at?: Date,
    public updated_at?: Date,
    public is_expired?: boolean,
  ) { }
}

export default JobAdvertisement;
