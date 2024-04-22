import { BaseService, ROUTE_ACTIONS } from '@/modules/BaseService';
import { IApiRequest } from '@/types/ApiRequest';
import { IApiUserProfile } from '@/types/ApiUser';
import { defineStore } from 'pinia';
import { useAuthStore } from './auth-store';

export const useProfileStore = defineStore('profile', {
	state: () => ({
		userProfile: {} as IApiUserProfile,
		savedProfile: {} as IApiUserProfile,
	}),
	actions: {
		async getProfile() {
			const resp = await BaseService.get<IApiRequest<IApiUserProfile>>(ROUTE_ACTIONS.Profile);
			console.table(resp.message);
			this.userProfile = resp.message;
			this.savedProfile = { ...this.userProfile };
		},
		async updateProfile() {
			this.userProfile.spotify_embedded_iframe = this.userProfile.spotify_embedded_iframe.replaceAll('&lt;', '<').replaceAll('&gt;', '>');
			const resp = await BaseService.patch<IApiRequest<IApiUserProfile>>(ROUTE_ACTIONS.Profile, this.userProfile);
			this.userProfile = resp.message;
			this.savedProfile = { ...this.userProfile };
			const authStore = useAuthStore();
			authStore.user.firstname = this.userProfile.firstname;
			authStore.user.lastname = this.userProfile.lastname;
			authStore.user.avatar = this.userProfile.avatar;
		},
	},
});
