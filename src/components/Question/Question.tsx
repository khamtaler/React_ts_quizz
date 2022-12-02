import { Questions } from '../../models/Questions';

export default function Question({ id, question, children }: Questions) {
	return (
		<section id={id}>
			<div>
				<h2 dangerouslySetInnerHTML={{ __html: question }}></h2>
				<div>{children}</div>
			</div>
		</section>
	);
}
