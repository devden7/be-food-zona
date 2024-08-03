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

interface orderItem {
  orderItemId: number;
  foodNameOrder: string;
}

interface restaurantCity {
  city_name: string;
}

export interface IOrderLists {
  orderId: number;
  orderItem: orderItem[];
  restaurant: restaurantCity;
  restaurantName: string;
  status: string;
  totalPrice: number;
  totalQuantity: number;
  username: string;
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
