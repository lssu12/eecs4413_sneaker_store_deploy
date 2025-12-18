import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import SneakerService from '../Service/SneakerService';
import { CartContext } from '../Context/CartContext';
import Toast from './Toast';
import { resolveSneakerImage } from '../Util/util';

const ProductDisplayPage = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const { addToCart } = useContext(CartContext);
  const [selectedSize, setSelectedSize] = useState(null);
  const [toast, setToast] = useState(null);

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

  const triggerToast = (message, type = 'info') => {
    setToast({ message, type });
  };

  const handleAddToCart = () => {
    if (!product) return;
    if (!selectedSize) {
      triggerToast('Please select a size', 'error');
      return;
    }

    const cartKey = `${product.id}-${selectedSize}`;
    console.log('[ProductDisplay] Adding to cart:', cartKey);
    addToCart(cartKey);
    triggerToast('Added to cart!', 'success');
  };

  if (!product) return <div className="text-center mt-10">Loading product...</div>;

  return (
    <>
      <Toast message={toast?.message} type={toast?.type} onClose={() => setToast(null)} />

      <div className="flex flex-col md:flex-row gap-[120px] mx-auto mt-5 max-w-[1400px] items-start justify-center px-4 text-brand-primary">
      
      {/* Left Image */}
      <div className="flex flex-col gap-5 bg-white border border-brand-muted rounded-3xl p-8 shadow-sm">
        <img
          src={resolveSneakerImage(product.imageUrl, product.name)}
          alt={product.name}
          className="w-[500px] h-[500px] object-cover rounded-2xl"
        />
      </div>

      {/* Right Details */}
      <div className="flex flex-col gap-5 bg-white border border-brand-muted rounded-3xl p-8 shadow-sm">
        <h1 className="text-[30px] font-display font-semibold">{product.name}</h1>
        <p><span className="font-bold mr-2">Brand:</span>{product.brand}</p>
        <p><span className="font-bold mr-2">Description:</span>{product.description}</p>

        <h2 className="text-[28px] text-brand-accent my-5">${product.price}</h2>
        {!!product.stock && (
          <p><span className="font-bold">In Stock:</span> {product.stock}</p>
        )}

        {/* Size Selection */}
        <div className="flex flex-col gap-2 mt-7">
          <h3 className="font-bold text-lg">Select Size</h3>
          <div className="flex gap-4 items-center flex-wrap">
            {product.availableSizes.map((size) => (
              <div
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`px-6 py-3 border rounded-full text-center cursor-pointer transition
                  ${selectedSize === size ? 'bg-brand-accent text-white border-brand-accent cursor-default' : 'border-brand-muted hover:border-brand-accent hover:text-brand-accent'}
                `}
              >
                {size}
              </div>
            ))}
          </div>
        </div>


        <button
          onClick={handleAddToCart}
          className="mt-8 w-[220px] py-4 text-lg font-semibold text-white bg-brand-primary rounded-full hover:bg-brand-secondary transition"
        >
          ADD TO CART
        </button>
      </div>
      </div>
    </>
  );
};

export default ProductDisplayPage;
