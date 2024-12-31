import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchPlayers } from "../api";

const Players = () => {
  const { id } = useParams();
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getPlayers = async () => {
      setLoading(true); // Set loading state to true before fetching data
      const data = await fetchPlayers(id);
      setPlayers(data);
      setLoading(false); // Set loading state to false after data is fetched
    };
    getPlayers();
  }, [id]);

  return (
    <div className="p-4">
      <h1 className="text-3xl font-semibold text-gray-800 mb-4">
        Players in Auction {id}
      </h1>
      <Link
        to={`/auction/${id}/players/add`}
        className="mb-4 inline-block bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
      >
        Add New Player
      </Link>

      {/* Show loading state */}
      {loading ? (
        <div className="flex justify-center items-center space-x-4">
          <div className="w-16 h-16 border-4 border-t-4 border-blue-600 rounded-full animate-spin"></div>
          <p className="text-lg text-gray-700">Loading players...</p>
        </div>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {players.map((player) => (
            <li
              key={player.id}
              className="bg-white p-4 rounded-lg shadow-md flex flex-col items-center"
            >
              <img
                src={`${process.env.REACT_APP_API_URL}${player.photo_path}`} // Adjust the path based on your API's file serving logic
                alt={player.name}
                className="w-32 h-32 object-cover rounded-full mb-4"
              />
              <span className="text-lg font-medium">{player.name}</span>
              <span className="text-sm text-gray-500">{player.position}</span>
              <span className="text-sm text-gray-500">
                {player.base_price} $
              </span>
              <Link
                to={`/auction/${id}/players/edit/${player.id}`}
                className="mt-2 text-blue-600 hover:underline"
              >
                Edit
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Players;
