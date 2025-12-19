import Hero from '../Components/Hero';
import Sneaker from './Sneaker';

const Home = () => {
  return (
    <div className="w-full bg-brand-surface text-brand-primary min-h-screen">

      <Hero />

      <section
        id="all-products"
        className="max-w-7xl mx-auto px-4 py-16"
      >
        <h1 className="text-3xl md:text-4xl font-display font-semibold text-center">
          All Products
        </h1>

			<hr className="my-6 w-32 mx-auto border-[3px] border-brand-accent rounded-full" />

        <Sneaker />
      </section>

    </div>
  );
};

export default Home;
