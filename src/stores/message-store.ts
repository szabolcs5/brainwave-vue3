import { BaseService, ROUTE_ACTIONS } from '@/modules/BaseService';
import { IApiMessage, IApiTranslate } from '@/types/ApiMessage';
import { IApiPaginatedRequest } from '@/types/ApiRequest';
import { defineStore } from 'pinia';

export const useMessageStore = defineStore('message', {
	state: () => ({
		messages: [] as IApiMessage[],
		total: -1,
		isLoadedAll: false,
	}),
	actions: {
		async getMessages(id: string, page: number, limit: number) {
			const response = await BaseService.get<IApiPaginatedRequest<IApiMessage>>(ROUTE_ACTIONS.Message, `/${id}?page=${page}&limit=${limit}`);
			this.messages = response.data.reverse().concat(this.messages);
			this.total = response.total;
			this.isLoadedAll = !response.data.length;
		},
		async sendBotMessage(message: string, targetLanguage: string) {
			const response = await BaseService.post<IApiTranslate>(ROUTE_ACTIONS.Translate, {
				text: [message],
				target_lang: targetLanguage,
			});
			return response.translations;
		},
	},
});
