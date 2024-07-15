export interface IRequestFormFood {
  foodName: string;
  description: string;
  price: number;
  category?: string;
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
