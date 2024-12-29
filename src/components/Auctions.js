import React, { useEffect, useState } from "react";
import { fetchAuctions } from "../api";
import { Link } from "react-router-dom";

const Auctions = () => {
  const [auctions, setAuctions] = useState([]);

  useEffect(() => {
    const getAuctions = async () => {
      const data = await fetchAuctions();
      setAuctions(data);
    };
    getAuctions();
  }, []);

  return (
    <div className="bg-gradient-to-r from-indigo-400 via-blue-500 to-teal-400 min-h-screen py-12 px-4">
      <div className="container mx-auto text-center mb-8">
        <h1 className="text-4xl font-extrabold text-white">Active Auctions</h1>
        <p className="text-xl text-white mt-2">Browse the available auctions</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {auctions.map((auction) => (
          <div
            key={auction.id}
            className="bg-white p-6 rounded-lg shadow-lg hover:scale-105 transform transition duration-300 ease-in-out"
          >
            <h3 className="text-2xl font-semibold text-gray-800">
              {auction.name}
            </h3>
            <p className="text-gray-600 mt-2">{auction.description}</p>
            <div className="mt-4 flex justify-between items-center">
              <Link
                to={`/auction/${auction.id}`}
                className="text-blue-600 hover:underline text-sm font-medium"
              >
                View Auction
              </Link>
              <Link
                to={`/auction/${auction.id}/start`}
                className="text-blue-600 hover:underline text-sm font-medium"
              >
                Start Auction
              </Link>
              <Link
                to={`/auction/edit/${auction.id}`}
                className="text-blue-600 hover:underline text-sm font-medium"
              >
                Edit Auction
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Auctions;
