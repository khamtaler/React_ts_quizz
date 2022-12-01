import React from 'react';
import { FormData } from '../models/FormData';
interface Props extends FormData {
	setShowQuizz: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Quiz({ numberOfQuestions, difficulty, setShowQuizz }: Props) {
	return <div>{numberOfQuestions}</div>;
}
