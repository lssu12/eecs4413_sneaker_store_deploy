import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import SneakerService from '../Service/SneakerService';
import { CartContext } from '../Context/CartContext';

const ProductDisplayPage = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const { addToCart } = useContext(CartContext);
  const [selectedSize, setSelectedSize] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await SneakerService.getSneakerById(productId);
        setProduct({ ...data, id: String(data.id) });
      } catch (err) {
        console.error('Failed to fetch product', err);
      }
    };
    fetchProduct();
  }, [productId]);

  const handleAddToCart = () => {
    if (!product) return;
    if (!selectedSize) {
      alert('Please select a size');
      return;
    }

    const cartKey = `${product.id}-${selectedSize}`;
    console.log('[ProductDisplay] Adding to cart:', cartKey);
    addToCart(cartKey);
    alert('Added to cart!');
  };

  if (!product) return <div className="text-center mt-10">Loading product...</div>;

  return (
    <div className="flex flex-col md:flex-row gap-[120px] mx-auto mt-5 max-w-[1400px] items-start justify-center px-4">
      
      {/* Left Image */}
      <div className="flex flex-col gap-5">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-[500px] h-[500px] object-cover"
        />
      </div>

      {/* Right Details */}
      <div className="flex flex-col gap-5">
        <h1 className="text-[30px] font-bold text-black">{product.name}</h1>
        <p><span className="font-bold mr-2">SKU:</span>{product.sku}</p>
        <p><span className="font-bold mr-2">Brand:</span>{product.brand}</p>
        <p><span className="font-bold mr-2">Description:</span>{product.description}</p>

        <h2 className="text-[28px] text-gray-800 my-5">${product.price}</h2>
        <p><span className="font-bold">In Stock:</span> {product.stock}</p>

        {/* Size Selection */}
        <div className="flex flex-col gap-2 mt-7">
          <h3 className="font-bold text-lg">Select Size</h3>
          <div className="flex gap-4 items-center">
            {product.availableSizes.map((size) => (
              <div
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`px-6 py-4 border border-gray-300 rounded-none text-center cursor-pointer transition
                  ${selectedSize === size ? 'bg-gray-300 text-gray-600 border-gray-400 cursor-default' : 'hover:bg-gray-200'}
                `}
              >
                {size}
              </div>
            ))}
          </div>
        </div>


        <button
          onClick={handleAddToCart}
          className="mt-8 w-[200px] py-5 text-lg font-bold text-white bg-red-600 hover:bg-red-800 transition"
        >
          ADD TO CART
        </button>
      </div>
    </div>
  );
};

export default ProductDisplayPage;
