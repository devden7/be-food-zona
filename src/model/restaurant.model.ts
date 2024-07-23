export interface IRegisterRestaurant {
  user: IAuthReq;
  restaurantName: string;
  city: string;
}

export interface IAuthReq {
  name: string;
  username: string;
  restaurant: string;
}

export interface IResponseRestaurant {
  username: string;
  restaurantName: string;
}
