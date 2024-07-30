export interface IRegisterUser {
  username: string;
  name: string;
  password: string;
}

export interface IRequestLoginUser {
  username: string;
  password: string;
}

export interface IReponseUser {
  username: string;
  name: string;
  restaurant?: string;
  token?: string;
}
