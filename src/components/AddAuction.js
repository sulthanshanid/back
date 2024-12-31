import React, { useState } from "react";
import { addAuction } from "../api";
import { useNavigate } from "react-router-dom";
//jj
const AddAuction = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [status, setStatus] = useState("upcoming");
  const [bidIncrement, setBidIncrement] = useState(10);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newAuction = {
      name,
      description,
      start_time: startTime,
      end_time: endTime,
      status,
      bid_increment: bidIncrement,
    };
    const result = await addAuction(newAuction);
    if (result.auctionId) {
      navigate(`/auction/${result.auctionId}`);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 py-8 px-4">
      <div className="w-full max-w-lg bg-white p-8 rounded-xl shadow-lg border-2 border-gray-300 transform transition-all duration-500 ease-in-out hover:scale-105">
        <h1 className="text-3xl font-semibold text-center text-gray-800 mb-6">
          Create a New Auction
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Auction Name */}
          <div>
            <label
              htmlFor="name"
              className="block text-gray-700 font-medium mb-2"
            >
              Auction Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter auction name"
              className="w-full p-4 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="description"
              className="block text-gray-700 font-medium mb-2"
            >
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter auction description"
              className="w-full p-4 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              rows="4"
              required
            ></textarea>
          </div>

          {/* Start Time */}

          {/* End Time */}

          {/* Bid Increment */}
          <div>
            <label
              htmlFor="bidIncrement"
              className="block text-gray-700 font-medium mb-2"
            >
              Bid Increment
            </label>
            <input
              id="bidIncrement"
              type="number"
              value={bidIncrement}
              onChange={(e) => setBidIncrement(e.target.value)}
              className="w-full p-4 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          {/* Status */}
          <div>
            <label
              htmlFor="status"
              className="block text-gray-700 font-medium mb-2"
            >
              Status
            </label>
            <input
              id="status"
              type="text"
              value={status}
              readOnly
              className="w-full p-4 border-2 border-gray-300 rounded-md bg-gray-100"
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-center">
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-3 rounded-md hover:bg-indigo-700 transition duration-300 ease-in-out transform hover:scale-105"
            >
              Create Auction
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddAuction;
