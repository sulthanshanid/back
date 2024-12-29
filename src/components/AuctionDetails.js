import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchAuction } from '../api';

const AuctionDetails = () => {
  const { id } = useParams();
  const [auction, setAuction] = useState(null);

  useEffect(() => {
    const getAuction = async () => {
      const data = await fetchAuction(id);
      setAuction(data);
    };
    getAuction();
  }, [id]);

  return auction ? (
    <div className="bg-gradient-to-r from-indigo-400 via-blue-500 to-teal-400 min-h-screen flex justify-center items-center py-12 px-4">
      <div className="w-full max-w-3xl bg-white p-8 rounded-lg shadow-xl">
        <h1 className="text-4xl font-semibold text-center text-gray-800 mb-6">{auction.name}</h1>
        <p className="text-lg text-gray-600 mb-8">{auction.description}</p>

        {/* Players Section */}
        <div className="mb-8">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">Players</h3>
          <div className="space-x-4">
            <Link
              to={`/auction/${id}/players`}
              className="inline-block text-blue-600 hover:text-blue-800 transition duration-300"
            >
              View Players
            </Link>
            <span>|</span>
            <Link
              to={`/auction/${id}/players/add`}
              className="inline-block text-blue-600 hover:text-blue-800 transition duration-300"
            >
              Add Player
            </Link>
          </div>
        </div>

        {/* Teams Section */}
        <div>
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">Teams</h3>
          <div className="space-x-4">
            <Link
              to={`/auction/${id}/teams`}
              className="inline-block text-blue-600 hover:text-blue-800 transition duration-300"
            >
              View Teams
            </Link>
            <span>|</span>
            <Link
              to={`/auction/${id}/teams/add`}
              className="inline-block text-blue-600 hover:text-blue-800 transition duration-300"
            >
              Add Team
            </Link>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <p className="text-center text-gray-600">Loading...</p>
  );
};

export default AuctionDetails;
