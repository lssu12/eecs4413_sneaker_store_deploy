import { useEffect, useState } from 'react';
import SneakerService from '../Service/SneakerService';
import Item from '../Components/Item';

const SneakerCategory = () => {
  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [genres, setGenres] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const INITIAL_FILTERS = {
    keyword: '',
    brand: '',
    category: '',
    genre: '',
    sortBy: '',
    direction: '',
  };
  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const [sortOrder, setSortOrder] = useState('');

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const data = await SneakerService.fetchSneakers();
        const uniqueBrands = [...new Set(data.map((p) => p.brand).filter(Boolean))];
        const uniqueCategories = [...new Set(data.map((p) => p.category).filter(Boolean))];
        const uniqueGenres = [...new Set(data.map((p) => p.genre).filter(Boolean))];
        setBrands(uniqueBrands);
        setCategories(uniqueCategories);
        setGenres(uniqueGenres);
      } catch (err) {
        console.error('Failed to load filter values', err);
      }
    };
    fetchFilters();
  }, []);

  const buildQueryParams = (input) => {
    const params = {};
    if (input.keyword) params.q = input.keyword;
    if (input.brand) params.brand = input.brand;
    if (input.category) params.category = input.category;
    if (input.genre) params.genre = input.genre;
    if (input.sortBy) params.sortBy = input.sortBy;
    if (input.direction) params.direction = input.direction;
    return params;
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const params = buildQueryParams(filters);
        const data = await SneakerService.fetchSneakers(params);
        setProducts(data);
      } catch (err) {
        console.error('Failed to fetch sneakers', err);
      }
    };
    fetchProducts();
  }, [filters]);

  const applySort = (value) => {
    setSortOrder(value);
    if (value === 'priceAsc') {
      setFilters((prev) => ({ ...prev, sortBy: 'price', direction: 'asc' }));
    } else if (value === 'priceDesc') {
      setFilters((prev) => ({ ...prev, sortBy: 'price', direction: 'desc' }));
    } else if (value === 'nameAsc') {
      setFilters((prev) => ({ ...prev, sortBy: 'name', direction: 'asc' }));
    } else if (value === 'nameDesc') {
      setFilters((prev) => ({ ...prev, sortBy: 'name', direction: 'desc' }));
    } else {
      setFilters((prev) => ({ ...prev, sortBy: '', direction: '' }));
    }
  };

  const handleSearch = () => {
    setFilters((prev) => ({ ...prev, keyword: searchInput.trim() }));
  };

  const handleReset = () => {
    setSearchInput('');
    setSortOrder('');
    setFilters({ ...INITIAL_FILTERS });
  };

  return (
    <div className="w-full bg-brand-surface py-10 text-brand-primary">
      <div className="max-w-7xl mx-auto px-4">

        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <input
            type="text"
            placeholder="Search sneakers..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="flex-1 px-4 py-2 border border-brand-muted rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-brand-accent"
          />
          <div className="flex gap-3">
            <button
              onClick={handleSearch}
              className="px-6 py-2 bg-brand-accent text-white rounded-md hover:bg-brand-accent-dark transition"
            >
              Search
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="px-5 py-2 border border-brand-muted text-brand-primary rounded-md bg-white hover:border-brand-accent hover:text-brand-accent transition"
            >
              Reset
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div>
            <label className="block text-sm font-medium mb-1">Brand</label>
            <select
              value={filters.brand}
              onChange={(e) => setFilters((prev) => ({ ...prev, brand: e.target.value }))}
              className="w-full px-3 py-2 border border-brand-muted rounded-md bg-white focus:ring-2 focus:ring-brand-accent"
            >
              <option value="">All Brands</option>
              {brands.map((brand) => (
                <option key={brand} value={brand}>{brand}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <select
              value={filters.category}
              onChange={(e) => setFilters((prev) => ({ ...prev, category: e.target.value }))}
              className="w-full px-3 py-2 border border-brand-muted rounded-md bg-white focus:ring-2 focus:ring-brand-accent"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Genre</label>
            <select
              value={filters.genre}
              onChange={(e) => setFilters((prev) => ({ ...prev, genre: e.target.value }))}
              className="w-full px-3 py-2 border border-brand-muted rounded-md bg-white focus:ring-2 focus:ring-brand-accent"
            >
              <option value="">All Genres</option>
              {genres.map((genre) => (
                <option key={genre} value={genre}>{genre}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Sort</label>
            <select
              value={sortOrder}
              onChange={(e) => applySort(e.target.value)}
              className="w-full px-3 py-2 border border-brand-muted rounded-md bg-white focus:ring-2 focus:ring-brand-accent"
            >
              <option value="">Default</option>
              <option value="priceAsc">Price: Low → High</option>
              <option value="priceDesc">Price: High → Low</option>
              <option value="nameAsc">Name: A → Z</option>
              <option value="nameDesc">Name: Z → A</option>
            </select>
          </div>
        </div>

        <p className="text-sm text-gray-600 mb-6">
          Showing <span className="font-semibold">{products.length}</span> products
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((item) => (
            <Item
              key={item.id}
              id={item.id}
              name={item.name}
              image={item.imageUrl}
              price={`$${item.price}`}
              stock={item.stock}
            />
          ))}
        </div>

      </div>
    </div>
  );
};

export default SneakerCategory;
