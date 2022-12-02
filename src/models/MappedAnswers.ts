export interface MappedAnswer {
	answer: string;
	isCorrect: boolean;
	isChecked: boolean;
	id: string;
	key: string;
	validation: boolean;
}

export interface MappedAnswers extends Array<MappedAnswer> {}
