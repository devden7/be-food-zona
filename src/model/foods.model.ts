export interface IRequestFormFood {
  foodName: string;
  description: string;
  price: number;
  fileImage?: Image | undefined;
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
}

export interface IResponseFormFood {
  message?: string;
  food: {
    name: string;
    description: string;
    price: number;
    image?: string | null;
  };
}

export interface dataFood {
  foodId: number;
  name: string;
  description: string;
  price: number;
}

export interface IResponseGetFoods {
  foods: dataFood[];
}
