import { Express } from 'express';

export interface IRequestFormFood {
  foodName: string;
  description: string;
  price: number;
  fileImage?: Express.Multer.File | undefined;
  category?: string;
  image?: string;
  userRestaurant: string;
}

export interface Image {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  destination: string;
  filename: string;
  path: string;
  size: number;
}

export interface IRequestFormUpdateFood {
  foodId: number;
  foodName: string;
  description: string;
  price: number;
  fileImage?: Express.Multer.File | undefined;
  category?: string;
  image?: string;
  userRestaurant: string;
}

export interface IResponseFormFood {
  message?: string;
  foods: {
    foodId?: number;
    name: string;
    description: string;
    price: number;
    public_id_img: string | null;
    format_img: string | null;
    version_img: string | null;
    restaurantName?: string;
  };
}

export interface dataFood {
  foodId: number;
  name: string;
  description: string;
  price: number;
  category?: string[];
  public_id_img: string | null;
  format_img: string | null;
  version_img: string | null;
  restaurantName?: string;
  totalPrice?: number;
  quantity?: number;
  isRecommendation?: boolean;
}

export interface IResponseGetFoods {
  foods: dataFood[];
  restaurantName?: string;
  reviews?: any[];
}

export interface IReqFoodsLists {
  city: string;
  category: string;
  limit?: number;
}
