import { useState, useEffect } from 'react';
import { FormData } from '../../models/FormData';
import { nanoid } from 'nanoid';
import Question from '../Question/Question';
import AnswerButton from '../AnswerButton/AnswerButton';
import { Questions } from '../../models/Questions';
import { MappedAnswer } from '../../models/MappedAnswers';
import { DataArray, Data } from '../../models/DataArray';

interface Props extends FormData {
	setShowQuizz: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Quiz({ numberOfQuestions, difficulty, setShowQuizz }: Props) {
	const [data, setData] = useState<DataArray>([]);
	const [remake, setRemake] = useState<boolean>(false);
	const [validation, setValidation] = useState<boolean>(false);

	const mapAnswers = (item: Questions) => {
		const { correct_answer, incorrect_answers } = item;
		const correct_answers: Array<string> = Array.isArray(correct_answer)
			? correct_answer
			: [correct_answer];
		const mappedCorrectAnswers = correct_answers.map((answer) => ({
			answer: answer,
			isCorrect: true,
			isChecked: false,
		}));
		const mappedIncorrectAnswers = incorrect_answers.map((answer) => ({
			answer: answer,
			isCorrect: false,
			isChecked: false,
		}));
		return [...mappedCorrectAnswers, ...mappedIncorrectAnswers];
	};

	function shuffleArray<T>(array: Array<T>): Array<T> {
		const newArray = [...array];
		for (let i = newArray.length - 1; i > 0; i--) {
			let j = Math.floor(Math.random() * (i + 1));
			const temp = newArray[i];
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
					data.results.map((item: Questions) => {
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

	const questions = data.map(({ question, id, answers }: Data) => {
		return (
			<Question key={id} question={question} id={id}>
				<>
					{answers.map(({ answer, isChecked, isCorrect }: MappedAnswer) => {
						return (
							<AnswerButton
								key={answer}
								answer={answer}
								isChecked={isChecked}
								chooseAnswer={(answerId) => chooseAnswer(id, answerId)}
								id={answer}
								validation={validation}
								isCorrect={isCorrect}
							/>
						);
					})}
				</>
			</Question>
		);
	});

	function chooseAnswer(questionId: string, answerId: string) {
		setData((questions) => {
			return questions.map((question) => {
				if (questionId === question.id) {
					return {
						...question,
						answers: question.answers.map((answer) => {
							if (answer.answer === answerId) {
								return { ...answer, isChecked: !answer.isChecked };
							} else if (answer.answer !== answerId) {
								return { ...answer, isChecked: false };
							}
							return answer;
						}),
					};
				}
				return question;
			});
		});
	}

	return <div>{questions}</div>;
}
