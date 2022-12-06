import { useState, useEffect, useRef, ReactElement } from 'react';
import axios from 'axios';
import { FormData } from '../../models/FormData';
import { nanoid } from 'nanoid';
import Question from '../Question/Question';
import AnswerButton from '../AnswerButton/AnswerButton';
import { Questions } from '../../models/Questions';
import { MappedAnswer } from '../../models/MappedAnswers';
import { DataArray, Data } from '../../models/DataArray';
import navStyles from './navigation.module.css';
import questionsStyles from './/Questions.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	faSquare,
	faArrowLeft,
	faArrowRight,
	faCheck,
	faRotateLeft,
	faGear,
	faArrowDown,
	faArrowUp,
} from '@fortawesome/free-solid-svg-icons';

interface Props extends FormData {
	setShowQuizz: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Quiz({ numberOfQuestions, difficulty, setShowQuizz }: Props) {
	const [data, setData] = useState<DataArray>([]);
	const [remake, setRemake] = useState<boolean>(false);
	const [validation, setValidation] = useState<boolean>(false);
	const [navigation, setNavigation] = useState<ReactElement[]>([]);
	const [sections, setSections] = useState<Array<Element>>([]);
	const [currentSection, setCurrentSection] = useState(0);
	const [points, setPoints] = useState<number>(0);
	const navigationTop = useRef<HTMLDivElement>(null);

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

	function checkAnswers() {
		setValidation(true);
	}
	function chooseAnswer(questionId: string, answerId: string) {
		setData((prevData) => {
			return prevData.map((question) => {
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

	function checkIfPoint(question: Data): string | undefined {
		if (question.isPoint == null) {
			return undefined;
		} else if (question.isPoint) {
			return `${navStyles.Navigation___correct}`;
		} else {
			return `${navStyles.Navigation___inCorrect}`;
		}
	}

	function newQuiz() {
		setRemake((prev) => !prev);
		window.scrollTo({ top: 0, behavior: 'smooth' });
		setCurrentSection(0);
		setPoints(0);
	}

	useEffect(() => {
		setNavigation(
			data.map((question: Data, index) => {
				const styles: string | undefined = checkIfPoint(question);
				return (
					<a
						key={question.id}
						href={`#${question.id}`}
						className={styles}
						onClick={() => setCurrentSection(index)}
					>
						<FontAwesomeIcon icon={faSquare} />
					</a>
				);
			})
		);
		setSections([...document.querySelectorAll('.question')] as Array<Element>);
	}, [data]);

	useEffect(() => {
		if (sections.length !== 0) {
			sections[currentSection].scrollIntoView({ behavior: 'smooth', block: 'start' });
			const { id: sectionId } = sections[currentSection];
			const hrefArray = document.querySelectorAll(`.nav a`);
			hrefArray.forEach((element) => {
				element.classList.remove('active');
			});
			const activeSection = document.querySelector(`[href="#${sectionId}"]`) as HTMLElement | null;
			if (activeSection != undefined) {
				activeSection.classList.add('active');
			}
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currentSection]);

	useEffect(() => {
		const url = `https://opentdb.com/api.php?amount=${numberOfQuestions}&difficulty=${difficulty}`;
		axios
			.get(url)
			.then((res) =>
				setData(
					res.data.results.map((item: Questions) => {
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

	useEffect(() => {
		setData((questions: DataArray) => {
			// setPoints(0);
			return questions.map((question: Data) => {
				return {
					...question,
					isPoint: question.answers.every((answer) => {
						if (answer.isChecked && answer.isCorrect) {
							setPoints((points) => points + 1);
							return true;
						}
						if (!answer.isChecked && !answer.isCorrect) {
							return true;
						}
						return false;
					}),
				};
			});
		});
	}, [validation]);

	return questions.length !== 0 ? (
		<main className={questionsStyles.Questions_main}>
			<div ref={navigationTop} className={`${navStyles.Navigation} nav`}>
				{navigation}
				<a href={'#final'} onClick={() => setCurrentSection(sections.length - 1)}>
					<FontAwesomeIcon icon={faSquare} />
				</a>
			</div>
			<div className={questionsStyles.Questions_container}>
				{questions}
				<div id="final" className={`${questionsStyles.Questions_finalStep} question`}>
					<div className={questionsStyles.Questions_checkContainer}>
						{validation && (
							<div className={questionsStyles.Questions_score}>
								{' '}
								{(points / data.length) * 100 >= 50 ? <h2> Hurray!</h2> : <h2>Whoopsie!</h2>}
							</div>
						)}
						{validation && (
							<h2>
								<span>Your score is: </span>
								<span>
									{points}/{data.length}
								</span>
								<br />
								<span>that's: </span>
								<span style={{ color: (points / data.length) * 100 >= 50 ? '#1bf11b' : 'red' }}>
									{Math.round((points / data.length) * 100)}%
								</span>
							</h2>
						)}
						<button
							className={`${questionsStyles.Questions_finalStep___check} button`}
							onClick={() => checkAnswers()}
						>
							<FontAwesomeIcon icon={faCheck} /> <span>check answers</span>
						</button>
						<button
							className={` ${questionsStyles.Questions_finalStep___replay} button`}
							onClick={() => {
								setValidation(false);

								newQuiz();
							}}
						>
							<FontAwesomeIcon icon={faRotateLeft} /> Replay quizz
						</button>

						<button
							className={` ${questionsStyles.Questions_finalStep___reset} button`}
							onClick={() => setShowQuizz(false)}
						>
							{' '}
							<FontAwesomeIcon icon={faGear} /> Reset settings
						</button>
					</div>
				</div>
			</div>
			<div className={navStyles.NavigationButtonsDesktop}>
				{currentSection !== 0 && (
					<button
						className={`${navStyles.NavigationButtons___top} button`}
						onClick={() => setCurrentSection((prev) => prev - 1)}
					>
						<FontAwesomeIcon icon={faArrowUp} /> previous
					</button>
				)}
				{currentSection !== sections.length - 1 && (
					<button
						className={`${navStyles.NavigationButtons___bottom} button`}
						onClick={() => setCurrentSection((prev) => prev + 1)}
					>
						next <FontAwesomeIcon icon={faArrowDown} />
					</button>
				)}
			</div>
			<div className={navStyles.NavigationButtonsMobile}>
				{currentSection !== 0 && (
					<button
						className={`${navStyles.NavigationButtons___top} button`}
						onClick={() => setCurrentSection((prev) => prev - 1)}
					>
						<FontAwesomeIcon icon={faArrowLeft} /> previous
					</button>
				)}
				{currentSection !== sections.length - 1 && (
					<button
						className={`${navStyles.NavigationButtons___bottom} button`}
						onClick={() => setCurrentSection((prev) => prev + 1)}
					>
						next <FontAwesomeIcon icon={faArrowRight} />
					</button>
				)}
			</div>
		</main>
	) : (
		<main className={questionsStyles.Questions_main}>
			<h2 className={questionsStyles.Questions_loading}>Loading...</h2>
		</main>
	);
}
