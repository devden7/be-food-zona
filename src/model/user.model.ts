export interface IRegisterUser {
  username: string;
  name: string;
  password: string;
}

export interface IRequestLoginUser {
  username: string;
  password: string;
}

export interface IFoodLists {
  foodId: number;
  name: string;
  description: string;
  price: string | number;
  category: string[];
  reviws?: number;
  image: string | null;
}
export interface IReponseUser {
  username: string;
  name: string;
  restaurant?: string;
  token?: string;
}
