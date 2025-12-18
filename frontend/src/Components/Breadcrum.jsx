import React from "react";

const Breadcrums = (props) => {
  const { product } = props;

  return (
    <div className="text-sm text-gray-600 mb-4">
      <span className="hover:text-black cursor-pointer">HOME</span>
      <span className="mx-2">&gt;</span>
      <span className="font-medium text-black">{product.name}</span>
    </div>
  );
};

export default Breadcrums;
