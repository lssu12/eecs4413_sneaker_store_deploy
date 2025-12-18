import React from 'react';
import { Link } from 'react-router-dom';
import { resolveSneakerImage } from '../Util/util';

const Item = (props) => {
	const imageSrc = resolveSneakerImage(props.image, props.name);

	return (
		<div className="w-[300px] flex flex-col items-center transition-transform duration-300 hover:-translate-y-1">
			<Link to={`/sneakers/${props.id}`} className="w-full">
				<div className="bg-white border border-brand-muted rounded-2xl shadow-sm overflow-hidden">
					<img
						src={imageSrc}
						alt={props.name}
						className="w-full h-auto object-cover"
					/>
					<p className="my-3 text-center text-lg font-medium text-brand-primary">{props.name}	</p>
				</div>
			</Link>

			<div className="flex gap-2 text-lg font-semibold text-brand-secondary mt-2">
				{props.price}
			</div>
		</div>
	);
};

export default Item;
