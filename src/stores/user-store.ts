import { BaseService, ROUTE_ACTIONS } from '@/modules/BaseService';
import { IApiAssignUser } from '@/types/ApiUser';
import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
	actions: {
		async assignUser(rolesWithLanguage: IApiAssignUser) {
			await BaseService.patch(ROUTE_ACTIONS.Assign, rolesWithLanguage);
		},
		async uploadProofs(proofs: string[]) {
			await BaseService.patch(ROUTE_ACTIONS.Proofs, {
				proofs,
			});
		},
	},
});
