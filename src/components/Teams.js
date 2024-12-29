import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchTeams } from "../api";

const Teams = () => {
  const { id } = useParams();
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getTeams = async () => {
      setLoading(true); // Set loading state to true before fetching data
      const data = await fetchTeams(id);
      setTeams(data);
      setLoading(false); // Set loading state to false after data is fetched
    };
    getTeams();
  }, [id]);

  return (
    <div className="p-4">
      <h1 className="text-3xl font-semibold text-gray-800 mb-4">
        Teams in Auction {id}
      </h1>
      <Link
        to={`/auction/${id}/teams/add`}
        className="mb-4 inline-block bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
      >
        Add New Team
      </Link>

      {/* Show loading state */}
      {loading ? (
        <div className="flex justify-center items-center space-x-4">
          <div className="w-16 h-16 border-4 border-t-4 border-blue-600 rounded-full animate-spin"></div>
          <p className="text-lg text-gray-700">Loading teams...</p>
        </div>
      ) : (
        <ul className="space-y-4">
          {teams.map((team) => (
            <li
              key={team.id}
              className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center"
            >
              <span className="text-lg font-medium">{team.name}</span>
              <Link
                to={`/auction/${id}/teams/edit/${team.id}`}
                className="text-blue-600 hover:underline"
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

export default Teams;
