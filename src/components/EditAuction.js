import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchAuction, updateAuction } from "../api";

const EditAuction = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [auction, setAuction] = useState({
    name: "",
    description: "",
    start_time: "",
    end_time: "",
    status: "",
    bid_increment: "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadAuction = async () => {
      try {
        const fetchedAuction = await fetchAuction(id);
        setAuction({
          name: fetchedAuction.name,
          description: fetchedAuction.description,
          status: fetchedAuction.status,
          bid_increment: fetchedAuction.bid_increment,
        });
        setLoading(false);
      } catch (err) {
        console.error("Error fetching auction:", err);
        setError("Failed to fetch auction details.");
        setLoading(false);
      }
    };

    loadAuction();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAuction((prevAuction) => ({
      ...prevAuction,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateAuction(id, {
        ...auction,
        // Convert back to API-friendly format
      });
      navigate("/dashboard"); // Redirect to the dashboard after successful update
    } catch (err) {
      console.error("Error updating auction:", err);
      setError("Failed to update auction.");
    }
  };

  if (loading) {
    return <p className="text-center text-lg text-gray-700">Loading...</p>;
  }

  if (error) {
    return <p className="text-center text-lg text-red-500">{error}</p>;
  }

  return (
    <div className="bg-gradient-to-r from-indigo-400 via-blue-500 to-teal-400 min-h-screen flex justify-center items-center py-12 px-4">
      <div className="w-full max-w-lg bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">
          Edit Auction
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Auction Name */}
          <div>
            <label
              htmlFor="name"
              className="block text-gray-600 font-medium mb-2"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={auction.name}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="description"
              className="block text-gray-600 font-medium mb-2"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={auction.description}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="4"
              required
            ></textarea>
          </div>

          {/* Start Time */}

          {/* Status */}
          <div>
            <label
              htmlFor="status"
              className="block text-gray-600 font-medium mb-2"
            >
              Status
            </label>
            <select
              id="status"
              name="status"
              value={auction.status}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select Status</option>
              <option value="upcoming">Upcoming</option>
              <option value="ongoing">Ongoing</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          {/* Bid Increment */}
          <div>
            <label
              htmlFor="bid_increment"
              className="block text-gray-600 font-medium mb-2"
            >
              Bid Increment
            </label>
            <input
              type="number"
              id="bid_increment"
              name="bid_increment"
              value={auction.bid_increment}
              onChange={handleChange}
              step="0.01"
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
              Update Auction
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditAuction;
