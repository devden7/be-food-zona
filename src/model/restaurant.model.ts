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

export interface IResCityList {
  city_name: string;
}
export interface IResponseRestaurant {
  username: string;
  name: string;
  restaurantName: string;
  token: string;
}
