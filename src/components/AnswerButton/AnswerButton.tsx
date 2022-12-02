import React from 'react';
import { MappedAnswer } from '../../models/MappedAnswers';
import styles from '../AnswerButton/AnswerButton.module.css';

interface Props extends MappedAnswer {
	chooseAnswer: React.Dispatch<string>;
}

export default function Button({
	isChecked,
	id,
	answer,
	validation,
	isCorrect,
	chooseAnswer,
}: Props) {
	const setButtonStyles = () => {
		if (!validation) {
			return isChecked ? '#d7d667' : 'rgb(166 134 213)';
		}
		if (isChecked && !isCorrect) {
			return '#F53434';
		}

		return isCorrect ? '#00b300' : 'rgb(166 134 213)';
	};
	const style = validation ? `${styles.AnswerButton} validation ` : `${styles.AnswerButton} `;

	return (
		<button
			aria-label="answer"
			className={style}
			style={{ background: setButtonStyles() }}
			onClick={() => {
				if (!validation) {
					chooseAnswer(id);
				}
			}}
			disabled={validation}
			dangerouslySetInnerHTML={{ __html: answer }}
		></button>
	);
}
