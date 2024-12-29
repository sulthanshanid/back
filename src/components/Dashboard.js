import React from "react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  return (
    <div className="bg-gradient-to-r from-indigo-400 via-blue-500 to-teal-400 min-h-screen flex justify-center items-center py-12 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-xl">
        <h1 className="text-4xl font-semibold text-center text-gray-800 mb-8">
          Dashboard
        </h1>
        <div className="space-y-6">
          <Link
            to="/auctions"
            className="block text-center text-white bg-blue-600 hover:bg-blue-700 rounded-md py-3 transition duration-300"
          >
            View Auctions
          </Link>
          <Link
            to="/auction/add"
            className="block text-center text-white bg-green-600 hover:bg-green-700 rounded-md py-3 transition duration-300"
          >
            Add New Auction
          </Link>
         
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
