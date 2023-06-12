class JobAdvertisement {
  constructor(
    public worker: any,
    public title: string,
    public description: string,
    public category: any,
    public district: any,
    public price: number,
    public price_type: any, // Tipo de valor (Hora, metro, dias, quantidade)
    public displacement_fee?: number, // Custo de deslocamento
    public uid?: string,
    public delivery_time?: string, // Tempo de entrega, se aplicável
    public media?: any, // Lista de imagens do anúncio
    public created_at?: Date,
    public updated_at?: Date,
    public is_expired?: boolean,
  ) { }
}

export default JobAdvertisement;
