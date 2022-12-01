import './App.css';
import { useState, ChangeEvent } from 'react';
import Quiz from './components/Quizz/Quiz';
import { FormData } from './models/FormData';
import styles from './components/Quizz/form.module.css';
import './index.css';

function App() {
	const [formData, setFormData] = useState<FormData>({ numberOfQuestions: 1, difficulty: 'easy' });
	const [showQuizz, setShowQuizz] = useState(false);

	function handleChange(e: ChangeEvent<HTMLInputElement>) {
		let { value, name } = e.target;

		if (name === 'numberOfQuestions') {
			const newNumberOfQuestions = Math.round(Math.max(0, Math.min(20, Number(value))));
			setFormData((prevForm) => ({
				...prevForm,
				[name]: newNumberOfQuestions,
			}));
			return;
		}
		setFormData((prevForm) => ({
			...prevForm,
			[name]: value,
		}));
	}

	function showNewQuiz() {
		if (formData.numberOfQuestions === 0) {
			alert('number of questions cannot be equal 0');
		} else setShowQuizz(true);
	}

	const appClasses = showQuizz ? `${styles.Quizz} ` : `${styles.Quizz} ${styles.Questions}`;

	return (
		<div className={appClasses}>
			{!showQuizz && (
				<div className={styles.Quizz_form}>
					<h1>Quizzletto</h1>
					{formData.numberOfQuestions === 20 && <h4>Question limit is 20, don't force yourself</h4>}
					<label htmlFor="numberOfQuestions">Set number of Questions</label>
					<input
						type="number"
						name="numberOfQuestions"
						onChange={handleChange}
						value={formData.numberOfQuestions}
						id="numberOfQuestions"
					></input>

					<fieldset className={styles.radio}>
						<div>
							<legend>Choose difficulty level</legend>

							<div>
								<label htmlFor="easy">
									<input
										type="radio"
										value="easy"
										name="difficulty"
										checked={formData.difficulty === 'easy'}
										onChange={handleChange}
										id="easy"
									/>
									easy
								</label>
							</div>

							<div>
								<label htmlFor="medium">
									<input
										type="radio"
										value="medium"
										name="difficulty"
										checked={formData.difficulty === 'medium'}
										onChange={handleChange}
										id="medium"
									/>
									medium
								</label>
							</div>

							<div>
								<label htmlFor="hard">
									<input
										type="radio"
										value="hard"
										name="difficulty"
										checked={formData.difficulty === 'hard'}
										onChange={handleChange}
										id="hard"
									/>
									hard
								</label>
							</div>
						</div>
					</fieldset>
					<button className={styles.Quizz_formButton} onClick={showNewQuiz}>
						Start!
					</button>
				</div>
			)}
			{showQuizz && <Quiz {...formData} setShowQuizz={setShowQuizz} />}
		</div>
	);
}

export default App;
