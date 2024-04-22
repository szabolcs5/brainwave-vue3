import { LEVELS } from '@/modules/Constants';
import { IApiReducedUser } from './ApiUser';

export interface IApiClassroom {
	_id: string;
	name: string;
	level: LEVELS;
	language: string;
	joinCode: string;
	teacher: IApiReducedUser;
	isLocked: boolean;
}
