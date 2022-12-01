import { useState, useEffect } from 'react';
import { FormData } from '../../models/FormData';
import { nanoid } from 'nanoid';

interface Props extends FormData {
	setShowQuizz: React.Dispatch<React.SetStateAction<boolean>>;
}
interface question {
	correct_answer: string;
	incorrect_answers: Array<string>;
}
interface mappedAnswer {
	answer: string;
	isCorrect: boolean;
	isChecked: boolean;
}
interface mappedAnswers extends Array<mappedAnswer> {}

export default function Quiz({ numberOfQuestions, difficulty, setShowQuizz }: Props) {
	const [data, setData] = useState([]);
	const [remake, setRemake] = useState(false);

	const mapAnswers = (item: question) => {
		const { correct_answer, incorrect_answers } = item;
		const correct_answers = Array.isArray(correct_answer) ? correct_answer : [correct_answer];
		const mappedCorrectAnswers = correct_answers.map((item) => ({
			answer: item,
			isCorrect: true,
			isChecked: false,
		}));
		const mappedIncorrectAnswers = incorrect_answers.map((item) => ({
			answer: item,
			isCorrect: false,
			isChecked: false,
		}));
		return [...mappedCorrectAnswers, ...mappedIncorrectAnswers];
	};

	function shuffleArray(array: mappedAnswers) {
		const newArray = [...array];
		for (var i = newArray.length - 1; i > 0; i--) {
			var j = Math.floor(Math.random() * (i + 1));
			var temp = newArray[i];
			newArray[i] = newArray[j];
			newArray[j] = temp;
		}
		return newArray;
	}

	useEffect(() => {
		let url = `https://opentdb.com/api.php?amount=${numberOfQuestions}&difficulty=${difficulty}`;
		fetch(url)
			.then((response) => response.json())

			.then((data) =>
				setData(
					data.results.map((item: question) => {
						const { correct_answer, incorrect_answers, ...rest } = item;
						const answers = shuffleArray(mapAnswers(item));
						return { ...rest, id: nanoid(), answers, isPoint: null };
					})
				)
			)
			.catch((err) => {
				console.log(err);
			});
	}, [remake]);
	console.log(data);
	return <div>{numberOfQuestions}</div>;
}
