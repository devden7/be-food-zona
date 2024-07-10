export interface IRegisterUser {
  username: string;
  name: string;
  password: string;
}

export interface IReponseUser {
  username: string;
  name: string;
  token?: string;
}
