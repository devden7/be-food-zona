export interface IRequestFormProduct {
  foodName: string;
  description: string;
  price: number;
  category: string;
}

export interface IResponseFormProduct {
  message?: string;
  food: {
    name: string;
    description: string;
    price: number;
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
