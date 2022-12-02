import { MappedAnswers } from './MappedAnswers';

export interface Questions {
	id: string;
	question: string;
	answers: MappedAnswers;
	correct_answer: string;
	incorrect_answers: Array<string>;
	validation: boolean;
	children: JSX.Element;
}
