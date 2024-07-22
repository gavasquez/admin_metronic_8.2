export interface Product {
  id:                  number;
  title:               string;
  slug:                string;
  sku:                 string;
  price_col:           number;
  price_usd:           number;
  description:         string;
  resumen:             string;
  imagen:              string;
  tags:                Tag[];
  brand_id:            number;
  brand:               Brand;
  categorie_first_id:  number;
  categorie_first:     Brand;
  categorie_second_id: number;
  categorie_second:    Brand;
  categorie_third_id:  number;
  categorie_third:     Brand;
  stock:               number;
  state:               string;
  created_at:          Date;
  images:              Image[];
}

export interface Brand {
  id:   number;
  name: string
}

export interface Tag {
  item_id:   number;
  item_text: string;
}


export interface Image {
  id:     number;
  imagen: string;
}
