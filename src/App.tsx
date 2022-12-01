import './App.css';
import { useState } from 'react';

function App() {
	interface FormData {
		numberOfQuestions: number;
		difficulty: string;
	}

	const [formData, setFormData] = useState<FormData>({ numberOfQuestions: 1, difficulty: 'easy' });
	const [showQuiz, setShowQuiz] = useState(false);

	function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
		let { value, name } = e.target;
		if (Number(value) > 20 && name === 'numberOfQuestions') {
			value = '20';
			setFormData((prevForm) => ({
				...prevForm,
				[name]: value,
			}));
		} else if (Number(value) < 0 && name === 'numberOfQuestions') {
			value = '0';
			setFormData((prevForm) => ({
				...prevForm,
				[name]: value,
			}));
		} else if (value === 'e' && name === 'numberOfQuestions') return;
		else if (Number(value) % 1 != 0 && name === 'numberOfQuestions') {
			setFormData((prevForm) => ({
				...prevForm,
				[name]: Math.round(Number(value)),
			}));
		} else {
			setFormData((prevForm) => ({
				...prevForm,
				[name]: value,
			}));
		}
	}
	console.log(formData);
	return (
		<div className="App">
			<div>
				<h1>Quizzletto</h1>
				<label htmlFor="numberOfQuestions">Set number of Questions</label>
				<input
					type="number"
					name="numberOfQuestions"
					onChange={handleChange}
					value={formData.numberOfQuestions}
					id="numberOfQuestions"
				></input>
			</div>
			<fieldset>
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
							easy{' '}
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
							medium{' '}
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
							hard{' '}
						</label>
					</div>
				</div>
			</fieldset>
			<button>Start!</button>
		</div>
	);
}

export default App;
