import React, { useContext } from "react";
import { SneakerContext } from "../Context/SneakerContext";
import { useParams } from "react-router-dom";
import Breadcrums from "../Components/Breadcrum";
import ProductDisplay from "../Components/ProductDisplay/ProductDisplay";

const Product = () => {
  const { all_product } = useContext(SneakerContext);
  const { productId } = useParams();

  const product = all_product.find((e) => e.id === Number(productId));

  if (!product) {
    return <div>Product not found...</div>;
  }

  return (
    <div>
      <Breadcrums product={product} />
      <ProductDisplay product={product} />
    </div>
  );
};
export default Product;
