import { BaseService } from '@/modules/BaseService';
import { IApiEntries } from '@/types/ApiEntries';
import { IApiAnswers, IApiQuestions, IApiQuiz, IApiQuizCreate } from '@/types/ApiQuiz';
import { IApiPaginatedRequest } from '@/types/ApiRequest';
import { defineStore } from 'pinia';

export const useQuizStore = defineStore('quiz', {
	state: () => ({
		quizzes: [] as IApiQuiz[],
		total: 0,
		entries: [] as IApiEntries[],
		totalEntries: 0,
		questions: [] as IApiQuestions[],
	}),
	actions: {
		async getQuizzes(classroomID: string) {
			const quizzes = await BaseService.getQuizzes<IApiPaginatedRequest<IApiQuiz>>(classroomID);
			this.quizzes = quizzes.data;
			this.total = quizzes.total;
		},
		async getEntries(classroomID: string, quizID: string) {
			this.entries = [];
			const entries = await BaseService.getEntries<IApiPaginatedRequest<IApiEntries>>(classroomID, quizID);
			this.entries = entries.data;
			this.totalEntries = entries.total;
		},
		async getQuizQuestions(classroomID: string, quizID: string) {
			this.questions = [];
			const questions = await BaseService.getQuizQuestions<IApiPaginatedRequest<IApiQuestions>>(classroomID, quizID);
			this.questions = questions.data;
		},
		async submitQuiz(classroomID: string, quizID: string, data: IApiAnswers[]) {
			await BaseService.submitQuiz(classroomID, quizID, {
				answers: data,
			});
		},
		async createQuiz(classroomID: string, data: IApiQuizCreate) {
			await BaseService.createQuiz(classroomID, data);
		},
	},
});
