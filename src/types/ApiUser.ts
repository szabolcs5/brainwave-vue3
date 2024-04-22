import { ROLES } from '@/modules/Constants';
import { IApiClassroom } from './ApiClassroom';
import { IApiChannel } from './ApiChannel';
import { IApiLanguage, IApiLanguageLevel } from './ApiLanguage';
import { IApiBook } from './ApiBook';
import { IApiSeries } from './ApiSeries';

export interface IApiUser {
	_id: string;
	email: string;
	avatar: string;
	nickname: string;
	lastname: string;
	firstname: string;
	confirmed_at: string;
	role: ROLES;
	classrooms: IApiClassroom[];
	channels: IApiChannel[];
	languages: IApiLanguage[];
}

export interface IApiReducedUser {
	nickname: string;
	email: string;
	_id: string;
	avatar: string;
}

export interface IApiUserProfile {
	_id: string;
	description: string;
	firstname: string;
	lastname: string;
	nickname: string;
	avatar: string;
	spotify_embedded_iframe: string;
	languages: IApiLanguage[];
	role: ROLES;
	current_book: IApiBook;
	current_tv_show: IApiSeries;
}

export interface IApiMessageUser {
	_id: string;
	nickname: string;
	avatar: string;
	role: number;
}

export interface IApiRegisterUser {
	firstname: string;
	lastname: string;
	nickname: string;
	email: string;
	password: string;
	avatar: string;
}

export interface IApiRegisteredUser {
	_id: string;
	email: string;
	avatar: string;
	nickname: string;
	lastname: string;
	firstname: string;
	confirmed_at: string;
	classrooms: [];
}

export interface IApiAssignUser {
	role: ROLES;
	languages: IApiLanguageLevel[];
}
