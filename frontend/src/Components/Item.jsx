import React from 'react';
import { Link } from 'react-router-dom';

const Item = (props) => {
	return (
		<div className="w-[300px] flex flex-col items-center transition-transform duration-300 hover:scale-105">
			<Link to={`/sneakers/${props.id}`} className="w-full">
				<img
					src={props.image}
					alt={props.name}
					className="w-full h-auto object-cover"
				/>
				<p className="my-1.5 text-center text-base text-black">{props.name}	</p>
			</Link>

			<div className="flex gap-2 text-lg font-semibold text-black">
				{props.price}
			</div>
		</div>
	);
};

export default Item;
