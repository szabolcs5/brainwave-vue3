import { BaseService, ROUTE_ACTIONS } from '@/modules/BaseService';
import { IApiLogin, IApiLoginResp } from '@/types/ApiLogin';
import { IApiAssignUser, IApiRegisterUser, IApiRegisteredUser, IApiUser } from '@/types/ApiUser';
import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
	state: () => ({
		user: {} as IApiUser,
		isLoggedIn: false,
		userToRegister: {} as IApiRegisteredUser,
	}),
	actions: {
		async login(credentials: IApiLogin) {
			const resp = await BaseService.post<IApiLoginResp>(ROUTE_ACTIONS.Login, credentials);
			localStorage.setItem('token', resp.token);
			localStorage.setItem('user', JSON.stringify(resp.user));
			BaseService.token = resp.token;
			this.isLoggedIn = true;
			this.user = resp.user;
		},
		async logout() {
			await BaseService.post(ROUTE_ACTIONS.Logout, {});
			localStorage.removeItem('token');
			BaseService.token = '';
			this.isLoggedIn = false;
			this.user = {} as IApiUser;
		},
		async register(account: IApiRegisterUser) {
			const resp = await BaseService.post<IApiRegisteredUser>(ROUTE_ACTIONS.Register, account);
			this.userToRegister = resp;
			await this.login({ email: account.email, password: account.password });
		},
	},
});
