import { BaseService } from '@/modules/BaseService';
import { defineStore } from 'pinia';

export const useClassroomStore = defineStore('classroom', {
	state: () => ({}),
	actions: {
		async joinClassroom(code: string) {
			return BaseService.joinClassroom(code);
		},
	},
});
