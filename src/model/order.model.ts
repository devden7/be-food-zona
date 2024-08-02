import { dataFood } from './foods.model';

export interface IReqOrder {
  items: dataFood[];
  calcPriceItem: number;
  totalQuantity: number;
  username: string;
}

export interface IResOrder {
  message: string;
}

export interface IReqOrderValidation {
  items: dataFood[];
  itemsBody?: dataFood[];
  calcPriceItem?: number;
  totalQuantity?: number;
  calcPriceItemBody?: number;
  totalQuantityBody?: number;
  idArr?: number[];
}
