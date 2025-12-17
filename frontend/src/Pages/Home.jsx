import Hero from '../Components/Hero/Hero';
import Sneaker from './Sneaker';

const Home = () => {
  return (
    <div className="w-full">

      <Hero />

      <section
        id="all-products"
        className="max-w-7xl mx-auto px-4 py-16"
      >
        <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-900">
          All Products
        </h1>

		<hr className="my-6 w-32 mx-auto border-4 border-red-500 rounded-full" />

        <Sneaker />
      </section>

    </div>
  );
};

export default Home;
