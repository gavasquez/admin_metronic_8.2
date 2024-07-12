export interface CategoiresResponse {
  total:      number;
  categories: Categories;
}

export interface Categories {
  data: Datum[];
}

export interface Datum {
  id:                  number;
  name:                string;
  icon:                null | string;
  imagen:              null | string;
  categorie_second_id: number | null;
  categorie_second:    Categorie | null;
  categorie_third_id:  number | null;
  categorie_third:     Categorie | null;
  position:            number;
  type_categorie:      number;
  state:               number;
  created_at:          Date;
}

export interface Categorie {
  name: string;
}
