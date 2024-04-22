export interface IApiQuiz {
	_id: string;
	title: string;
	createdAt: string;
	updatedAt: string;
	classroom_id: string;
}

export interface IApiQuestions {
	_id: string;
	title: string;
	answers: string[];
}

export interface IApiAnswers {
	_id: string;
	answer: string;
}

export interface IApiQuizCreate {
	title: string;
	questions: IApiQuestionCreate[];
}

export interface IApiQuestionCreate extends Omit<IApiQuestions, '_id'> {
	correctAnswer: string | number;
}
