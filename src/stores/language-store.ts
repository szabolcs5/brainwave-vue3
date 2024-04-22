import { BaseService, ROUTE_ACTIONS } from '@/modules/BaseService';
import { IApiLanguageAbbr } from '@/types/ApiLanguage';
import { defineStore } from 'pinia';

export const useLanguageStore = defineStore('language', {
	state: () => ({
		languages: [] as IApiLanguageAbbr[],
	}),
	actions: {
		async getLanguages() {
			const response = await BaseService.get<IApiLanguageAbbr[]>(ROUTE_ACTIONS.Language);
			this.languages = response;
			return response;
		},
	},
});
