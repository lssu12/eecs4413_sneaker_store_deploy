import { useEffect, useState } from 'react';
import SneakerService from '../Service/SneakerService';
import Item from '../Components/Item';

const SneakerCategory = () => {
  const [products, setProducts] = useState([]);
  const [sortOrder, setSortOrder] = useState('');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [brands, setBrands] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await SneakerService.getAllSneakers();
        setProducts(data);
        const uniqueBrands = [...new Set(data.map((p) => p.brand))];
        setBrands(uniqueBrands);
      } catch (err) {
        console.error('Failed to fetch sneakers', err);
      }
    };
    fetchProducts();
  }, []);

  const handleSearch = async () => {
    try {
      if (!searchKeyword) {
        const data = await SneakerService.getAllSneakers();
        setProducts(data);
      } else {
        const results = await SneakerService.searchSneakers(searchKeyword);
        setProducts(results);
      }
    } catch (err) {
      console.error('Failed to search sneakers', err);
    }
  };

  const filteredProducts = selectedBrand
    ? products.filter((p) => p.brand === selectedBrand)
    : products;

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortOrder === 'priceAsc') return a.price - b.price;
    if (sortOrder === 'priceDesc') return b.price - a.price;
    if (sortOrder === 'nameAsc') return a.name.localeCompare(b.name);
    if (sortOrder === 'nameDesc') return b.name.localeCompare(a.name);
    return 0;
  });

  return (
    <div className="w-full bg-gray-50 py-10">
      <div className="max-w-7xl mx-auto px-4">

        {/* Search Bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <input
            type="text" placeholder="Search sneakers..." value={searchKeyword} onChange={(e) => setSearchKeyword(e.target.value)}
            className="flex-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          <button
            onClick={handleSearch}
            className="px-6 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
          >
            Search
          </button>
        </div>

        {/* Filters + Sorting */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-10">
          <p className="text-sm text-gray-600">
            Showing <span className="font-semibold">1 - {sortedProducts.length}</span> of {products.length} products
          </p>

          <div className="flex gap-3">
            <select
              value={selectedBrand} onChange={(e) => setSelectedBrand(e.target.value)}
              className="px-3 py-2 border rounded-md focus:ring-2 focus:ring-red-500"
            >
              <option value="">All Brands</option>
              {brands.map((brand) => (
                <option key={brand} value={brand}>{brand}</option>
              ))}
            </select>

            <select
              value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}
              className="px-3 py-2 border rounded-md focus:ring-2 focus:ring-red-500"
            >
              <option value="">Sort by</option>
              <option value="priceAsc">Price: Low → High</option>
              <option value="priceDesc">Price: High → Low</option>
              <option value="nameAsc">Name: A → Z</option>
              <option value="nameDesc">Name: Z → A</option>
            </select>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {sortedProducts.map((item) => (
            <Item
              key={item.id} id={item.id} name={item.name} image={item.imageUrl} price={`$${item.price}`}
            />
          ))}
        </div>

      </div>
    </div>
  );
};

export default SneakerCategory;
