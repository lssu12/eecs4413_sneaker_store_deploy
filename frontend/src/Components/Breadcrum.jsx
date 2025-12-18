import React from "react";

const Breadcrums = (props) => {
  const { product } = props;

	return (
		<div className="text-sm text-brand-secondary mb-4">
			<span className="hover:text-brand-accent cursor-pointer">HOME</span>
			<span className="mx-2">&gt;</span>
			<span className="font-medium text-brand-primary">{product.name}</span>
		</div>
	);
};

export default Breadcrums;
