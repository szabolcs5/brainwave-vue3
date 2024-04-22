import { IApiUser } from './ApiUser';

export interface IApiLogin {
	email: string;
	password: string;
}

export interface IApiLoginResp {
	token: string;
	user: IApiUser;
}
