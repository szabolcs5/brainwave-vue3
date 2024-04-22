import { BaseService, ROUTE_ACTIONS } from '@/modules/BaseService';
import { defineStore } from 'pinia';

export const useFeedbackStore = defineStore('feedback', {
	state: () => ({}),
	actions: {
		async sendFeedback(feedback: string, rate: number) {
			const response = await BaseService.post(ROUTE_ACTIONS.Feedback, { title: 'Sent from frontend!', text: feedback, rate });
			return response;
		},
	},
});
