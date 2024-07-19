import { Product } from './product.interface';

export interface ResponseProducts {
  total:    number;
  products: Products;
}

export interface Products {
  data: Product[];
}

