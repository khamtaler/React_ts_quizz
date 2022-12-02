import { Questions } from '../../models/Questions';
import { ReactNode } from 'react';

interface Props extends Pick<Questions, 'id' | 'question'> {
	children: ReactNode;
}

export default function Question({ id, question, children }: Props) {
	return (
		<section id={id}>
			<div>
				<h2 dangerouslySetInnerHTML={{ __html: question }}></h2>
				<div>{children}</div>
			</div>
		</section>
	);
}
