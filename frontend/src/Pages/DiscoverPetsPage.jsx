import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import axios from "axios";

const DiscoverPetsPage = () => {
  const [pets, setPets] = useState([]);
  const [filteredPets, setFilteredPets] = useState([]);

  const [searchTerm, setSearchTerm] = useState('');
  const [type, setType] = useState('All');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [vaccinatedOnly, setVaccinatedOnly] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const petsPerPage = 6;

  const fetchPets = async () => {
    try {
      const params = {
        search: searchTerm.trim(),
        type: type !== 'All' ? type : undefined,
        minPrice: minPrice || undefined,
        maxPrice: maxPrice || undefined,
        vaccinated: vaccinatedOnly || undefined,
      };

      const res = await axios.get("http://localhost:5000/api/pets/discover-pets", { params });
      setPets(res.data);
      setFilteredPets(res.data);
      setCurrentPage(1);
    } catch (err) {
      console.error("Error fetching pets:", err);
    }
  };

  useEffect(() => {
    fetchPets(); // Initial load
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchPets();
  };

  const handleReset = () => {
    setSearchTerm('');
    setType('All');
    setMinPrice('');
    setMaxPrice('');
    setVaccinatedOnly(false);
    fetchPets();
  };

  const indexOfLastPet = currentPage * petsPerPage;
  const indexOfFirstPet = indexOfLastPet - petsPerPage;
  const currentPets = filteredPets.slice(indexOfFirstPet, indexOfLastPet);
  const totalPages = Math.ceil(filteredPets.length / petsPerPage);

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-center text-3xl font-bold mb-2">Pet Listings</h2>
        <p className="text-center text-gray-600 mb-6">
          Find the perfect pet for you from our diverse range
        </p>

        {/* Search & Filters */}
        <form onSubmit={handleSearch} className="flex flex-wrap gap-2 justify-center mb-6">
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="All">All Types</option>
            <option value="Dog">Dog</option>
            <option value="Cat">Cat</option>
            <option value="Bird">Bird</option>
          </select>

          <input
            type="text"
            placeholder="Search by name, breed, type..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border p-2 rounded w-64"
          />
          <input
            type="number"
            placeholder="Min Price"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="border p-2 rounded w-28"
          />
          <input
            type="number"
            placeholder="Max Price"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="border p-2 rounded w-28"
          />
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={vaccinatedOnly}
              onChange={() => setVaccinatedOnly(!vaccinatedOnly)}
            />
            <span className="text-sm">Vaccinated</span>
          </label>
          <button
            type="submit"
            className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
          >
            Search
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
          >
            Reset
          </button>
        </form>

        {/* Pet Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {currentPets.length > 0 ? currentPets.map((pet) => (
            <div key={pet._id} className="border rounded shadow-md overflow-hidden">
              <div className="aspect-video">
                <img
                  src={pet.images?.[0] || "/no-image.jpg"}
                  alt={pet.name}
                  className="w-full h-full object-cover object-center"
                />
              </div>
              <div className="p-4">
                <h3 className="font-bold mb-1">{pet.name}</h3>
                <p>{pet.gender}, {pet.age} Year{pet.age > 1 ? 's' : ''} Old</p>
                <p className="text-purple-600">{pet.type}</p>
                <p className="mb-3 font-bold text-purple-700">PKR {pet.price.toLocaleString()}</p>
                <Link to={`/pet/${pet._id}`}>
                  <button className="bg-purple-600 text-white px-4 py-2 rounded w-full hover:bg-purple-700">
                    View Details
                  </button>
                </Link>
              </div>
            </div>
          )) : (
            <p className="text-center col-span-3 text-gray-500">No pets found for your search.</p>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center mt-8 space-x-2">
            <button
              onClick={handlePrevious}
              className={`px-4 py-2 rounded ${currentPage === 1 ? "bg-gray-300" : "bg-orange-500 text-white hover:bg-orange-600"}`}
              disabled={currentPage === 1}
            >
              Previous
            </button>

            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index + 1}
                onClick={() => setCurrentPage(index + 1)}
                className={`px-4 py-2 rounded ${currentPage === index + 1 ? "bg-orange-500 text-white" : "bg-gray-200"}`}
              >
                {index + 1}
              </button>
            ))}

            <button
              onClick={handleNext}
              className={`px-4 py-2 rounded ${currentPage === totalPages ? "bg-gray-300" : "bg-orange-500 text-white hover:bg-orange-600"}`}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default DiscoverPetsPage;
