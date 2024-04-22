import axios from 'axios';

export enum ROUTE_ACTIONS {
	Login = 'Login',
	Logout = 'Logout',
	Register = 'Register',
	Profile = 'Profile',
	Feedback = 'Feedback',
	JoinClassroom = 'JoinClassroom',
	Message = 'Message',
	Translate = 'Translate',
	Language = 'Language',
	Assign = 'Assign',
	Proofs = 'Proofs',
	Quizzes = 'Quizzes',
	Entries = 'Entries',
}

export const backendRoutes: Record<ROUTE_ACTIONS, string> = {
	[ROUTE_ACTIONS.Login]: '/login',
	[ROUTE_ACTIONS.Logout]: '/logout',
	[ROUTE_ACTIONS.Register]: '/register',
	[ROUTE_ACTIONS.Profile]: '/profile',
	[ROUTE_ACTIONS.Feedback]: '/feedbacks',
	[ROUTE_ACTIONS.JoinClassroom]: '/classrooms',
	[ROUTE_ACTIONS.Message]: '/messages',
	[ROUTE_ACTIONS.Translate]: '/translate',
	[ROUTE_ACTIONS.Language]: '/languages',
	[ROUTE_ACTIONS.Assign]: '/users',
	[ROUTE_ACTIONS.Proofs]: '/users/proofs',
	[ROUTE_ACTIONS.Quizzes]: '/quizzes',
	[ROUTE_ACTIONS.Entries]: '/entries',
};

export class BaseService {
	public static apiUrl = import.meta.env.VITE_APP_BACKEND_URL;
	public static token = localStorage.getItem('token');

	static async get<T>(route: ROUTE_ACTIONS, queryParams?: string): Promise<T> {
		axios.defaults.withCredentials = true;
		const response = await axios.get<T>(`${BaseService.apiUrl}${backendRoutes[route]}${queryParams ?? ''}`);
		return response.data;
	}

	static async post<T>(route: ROUTE_ACTIONS, data: unknown): Promise<T> {
		axios.defaults.withCredentials = true;
		const response = await axios.post<T>(`${this.apiUrl}${backendRoutes[route]}`, data);
		return response.data;
	}

	static async patch<T>(route: ROUTE_ACTIONS, data: unknown): Promise<T> {
		axios.defaults.withCredentials = true;
		const response = await axios.patch<T>(`${this.apiUrl}${backendRoutes[route]}`, data);
		return response.data;
	}

	static async joinClassroom(code: string) {
		axios.defaults.withCredentials = true;
		const response = await axios.post(`${BaseService.apiUrl}${backendRoutes['JoinClassroom']}/${code}`);
		return response.data;
	}

	static async getQuizzes<T>(classroomID: string) {
		axios.defaults.withCredentials = true;
		const response = await axios.get<T>(`${BaseService.apiUrl}${backendRoutes['JoinClassroom']}/${classroomID}${backendRoutes['Quizzes']}`);
		return response.data;
	}

	static async getEntries<T>(classroomID: string, quizID: string) {
		axios.defaults.withCredentials = true;
		const response = await axios.get<T>(
			`${BaseService.apiUrl}${backendRoutes['JoinClassroom']}/${classroomID}${backendRoutes['Quizzes']}/${quizID}${backendRoutes['Entries']}`,
		);
		return response.data;
	}

	static async getQuizQuestions<T>(classroomID: string, quizID: string) {
		axios.defaults.withCredentials = true;
		const response = await axios.get<T>(`${BaseService.apiUrl}${backendRoutes['JoinClassroom']}/${classroomID}${backendRoutes['Quizzes']}/${quizID}`);
		return response.data;
	}

	static async submitQuiz(classroomID: string, quizID: string, data: unknown) {
		axios.defaults.withCredentials = true;
		const response = await axios.post(`${BaseService.apiUrl}${backendRoutes['JoinClassroom']}/${classroomID}${backendRoutes['Quizzes']}/${quizID}`, data);
		return response.data;
	}

	static async createQuiz(classroomID: string, data: unknown) {
		axios.defaults.withCredentials = true;
		const response = await axios.post(`${BaseService.apiUrl}${backendRoutes['JoinClassroom']}/${classroomID}${backendRoutes['Quizzes']}`, data);
		return response.data;
	}
}
