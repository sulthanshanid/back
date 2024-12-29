import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchPlayer, updatePlayer } from "../api";

const EditPlayer = () => {
  const { id, playerId } = useParams();
  const [player, setPlayer] = useState(null);

  useEffect(() => {
    const getPlayer = async () => {
      const data = await fetchPlayer(id, playerId);
      setPlayer(data);

      // Set the form fields after the player data is fetched
      if (data) {
        setName(data.name);
        setPosition(data.position);
        setPrice(data.base_price);
      }
    };
    getPlayer();
  }, [id, playerId]);

  const [name, setName] = useState("");
  const [position, setPosition] = useState("");
  const [base_price, setPrice] = useState(0);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedPlayer = { name, position, base_price };
    await updatePlayer(id, playerId, updatedPlayer);
    navigate(`/auction/${id}/players`);
  };

  return player ? (
    <div className="bg-gradient-to-r from-indigo-400 via-blue-500 to-teal-400 min-h-screen flex justify-center items-center py-12 px-4">
      <div className="w-full max-w-lg bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-semibold text-center text-gray-800 mb-6">Edit Player {player.name}</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Player Name */}
          <div>
            <label htmlFor="name" className="block text-gray-600 font-medium mb-2">Player Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Player Name"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Position */}
          <div>
            <label htmlFor="position" className="block text-gray-600 font-medium mb-2">Position</label>
            <input
              type="text"
              id="position"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              placeholder="Position"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Base Price */}
          <div>
            <label htmlFor="base_price" className="block text-gray-600 font-medium mb-2">Price</label>
            <input
              type="number"
              id="base_price"
              value={base_price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Price"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-center">
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition duration-300"
            >
              Save Player
            </button>
          </div>
        </form>
      </div>
    </div>
  ) : (
    <p className="text-center text-lg text-gray-700">Loading player...</p>
  );
};

export default EditPlayer;
