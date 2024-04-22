import { LEVELS } from '@/modules/Constants';

export interface IApiLanguage {
	language: string;
	level: LEVELS;
	createdAt: string;
	updatedAt: string;
}

export interface IApiLanguageLevel {
	language: string;
	level: LEVELS;
}

export interface IApiLanguageAbbr {
	name: string;
	abbreviation: string;
}
