import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchTeam, updateTeam } from "../api";

const EditTeam = () => {
  const { id, teamId } = useParams();
  const [team, setTeam] = useState(null);
  const [name, setName] = useState("");
  const [budget, setBudget] = useState(0);
  const [logo, setLogo] = useState(null); // State to hold the logo file
  const [logoPath, setLogoPath] = useState(""); // State to hold the logo path
  const [isUploading, setIsUploading] = useState(false); // Track logo upload status

  const navigate = useNavigate();

  useEffect(() => {
    const getTeam = async () => {
      const data = await fetchTeam(id, teamId);
      setTeam(data);
      setName(data.name);
      setBudget(data.budget);
      setLogoPath(data.logo_path || ""); // Set the logo path if available
    };
    getTeam();
  }, [id, teamId]);

  // Handle logo upload
  const handleLogoUpload = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    setIsUploading(true); // Set uploading status to true while uploading

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (response.ok) {
        const result = await response.json();
        setLogoPath(result.filePath); // Store the uploaded logo path
        setIsUploading(false); // Reset upload status
      } else {
        alert("Logo upload failed");
        setIsUploading(false); // Reset upload status
      }
    } catch (error) {
      console.error("Error uploading logo:", error);
      alert("Error uploading logo");
      setIsUploading(false); // Reset upload status
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedTeam = {
      name,
      budget,
      logo_path: logoPath, // Include the logo path if updated
    };

    try {
      await updateTeam(id, teamId, updatedTeam);
      navigate(`/auction/${id}/teams`);
    } catch (error) {
      console.error("Error updating team:", error);
      alert("Error updating team");
    }
  };

  return team ? (
    <div className="bg-gradient-to-r from-indigo-400 via-blue-500 to-teal-400 min-h-screen flex justify-center items-center py-12 px-4">
      <div className="w-full max-w-lg bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-semibold text-center text-gray-800 mb-6">
          Edit Team {team.name}
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Team Name */}
          <div>
            <label
              htmlFor="name"
              className="block text-gray-600 font-medium mb-2"
            >
              Team Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Team Name"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Budget */}
          <div>
            <label
              htmlFor="budget"
              className="block text-gray-600 font-medium mb-2"
            >
              Budget
            </label>
            <input
              type="number"
              id="budget"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              placeholder="Budget"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Logo Upload */}
          <div>
            <label
              htmlFor="logo"
              className="block text-gray-600 font-medium mb-2"
            >
              Upload Team Logo
            </label>
            <input
              type="file"
              id="logo"
              accept="image/*"
              onChange={(e) => {
                setLogo(e.target.files[0]);
                handleLogoUpload(e.target.files[0]);
              }}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isUploading} // Disable while uploading
            />
            {logoPath && !isUploading && (
              <div className="mt-2">
                <img
                  src={`${process.env.REACT_APP_API_URL}/${logoPath}`}
                  alt="Team Logo"
                  className="w-32 h-32 object-cover rounded-full mx-auto"
                />
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex justify-center">
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition duration-300"
              disabled={isUploading}
            >
              {isUploading ? "Uploading..." : "Save Team"}
            </button>
          </div>
        </form>
      </div>
    </div>
  ) : (
    <p className="text-center text-lg text-gray-700">Loading team...</p>
  );
};

export default EditTeam;
