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
  tags:                string;
  brand_id:            number;
  brand:               Brand;
  categorie_first_id:  number;
  categorie_first:     Brand;
  categorie_second_id: number | null;
  categorie_second:    Brand | null;
  categorie_third_id:  number | null;
  categorie_third:     Brand | null;
  stock:               number;
  state:               string;
  created_at:          Date;
}

export interface Brand {
  id:   number;
  name: string;
}
