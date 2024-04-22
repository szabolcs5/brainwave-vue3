import { IApiMessageUser } from './ApiUser';

export interface IApiMessage {
	message: string;
	chat_id: string;
	from: IApiMessageUser;
	scheduled_at: string;
	created_at: string;
}

export interface IApiTranslate {
	translations: IApiTranslation[];
}

export interface IApiTranslation {
	detected_source_language: string;
	text: string;
}
