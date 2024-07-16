import { Property } from './property';

export interface Attribute {
  id:             number;
  name:           string;
  type_attribute: number;
  state:          number;
  created_at:     Date;
  properties:     Property[];
}
