import { MappedAnswers } from './MappedAnswers';

export interface Data {
	answers: MappedAnswers;
	category: string;
	difficulty: string;
	id: string;
	isPoint: boolean;
	question: string;
	type: string;
}

export interface DataArray extends Array<Data> {}
