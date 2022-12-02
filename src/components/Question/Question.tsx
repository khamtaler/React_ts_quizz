import { Questions } from '../../models/Questions';
import { ReactNode } from 'react';
import Quizz_form from '../Quizz/form.module.css';
import singleQuestionStyles from './SingleQuestion.module.css';
interface Props extends Pick<Questions, 'id' | 'question'> {
	children: ReactNode;
}

export default function Question({ id, question, children }: Props) {
	return (
		<section id={id} className={` ${singleQuestionStyles.Question}   question`}>
			<div className={`${Quizz_form.Quizz_form} ${singleQuestionStyles.Question_container} `}>
				<h2 dangerouslySetInnerHTML={{ __html: question }}></h2>
				<div className={singleQuestionStyles.Question_answers}>{children}</div>
			</div>
		</section>
	);
}
