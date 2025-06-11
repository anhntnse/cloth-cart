import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import TitleWithSocial from "../components/TitleWithSocial";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 8;
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState({
    price: "",
  });

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(data));
  }, []);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1); // Reset to first page on search change
  };

  const handleFilterChange = (event) => {
    setFilter({ ...filter, [event.target.name]: event.target.value });
    setCurrentPage(1); // Reset to first page on filter change
  };

  // Apply search and filter logic
  const filteredProducts = products.filter((product) => {
    const matchesSearchQuery = product.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    const matchesPriceFilter =
      filter.price === "" ||
      (filter.price === "low"
        ? product.price < 300000
        : product.price >= 300000);

    return matchesSearchQuery && matchesPriceFilter;
  });

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="mt-2">
      {/* Video banner */}
      <div className="relative mt-1 w-full max-h-[500px] mb-4">
        <video
          src="/videos/banner.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="w-full max-h-[500px] object-cover"
        />
        <div className="absolute bottom-4 left-4 bg-black/10 px-4 py-2 rounded-md">
          <h2 className="text-white text-xl md:text-3xl font-semibold">
            Wear Confidence. Wear Fashion.
          </h2>
        </div>
      </div>
      <TitleWithSocial />

      {/* Search Bar */}
      <div className="my-6 px-4 md:px-0 max-w-7xl mx-auto">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Search products..."
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-pink-500"
        />
      </div>

      {/* Price Filter */}
      <div className="flex gap-4 justify-center my-6">
        <select
          name="price"
          value={filter.price}
          onChange={handleFilterChange}
          className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-0 hover:bg-gray-300"
        >
          <option value="">All Prices</option>
          <option value="low">Under 300,000 VND</option>
          <option value="high">Above 300,000 VND</option>
        </select>
      </div>

      {filteredProducts.length === 0 ? (
        <p>No products match your criteria.</p>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 mx-[100px]">
            {currentProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>

          {/* Pagination buttons */}
          <div className="flex justify-center space-x-2">
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index + 1}
                onClick={() => handlePageChange(index + 1)}
                className={`px-4 py-2 text-sm font-medium rounded-full shadow-sm transition-all duration-200
        ${
          currentPage === index + 1
            ? "bg-black text-white"
            : "bg-white text-gray-800 border border-gray-300 hover:bg-gray-100"
        }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
