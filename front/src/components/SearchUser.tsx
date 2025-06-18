import React, { useState } from "react";
import axios from "axios";

interface SearchUserProps {
  onUserSelect: (user: any) => void;
}

const SearchUser: React.FC<SearchUserProps> = ({ onUserSelect }) => {
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);

  const handleSearch = async () => {
    try {
      const response = await axios.get(
        `http://localhost:4000/users?search=${search}`
      );
      setUsers(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="p-4 h-40 overflow-auto">
      <input
        type="text"
        placeholder="Search users..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className=" p-2 border rounded-xl bg-black text-white border-white border-2"
      />
      <button
        onClick={handleSearch}
        className="ml-2 p-2 bg-blue-500 text-white rounded-lg  "
      >
        Search
      </button>
      <div className="user-list mt-4">
        {users.map((user) => (
          <div
            key={user.id}
            onClick={() => onUserSelect(user)}
            className="p-2 border-b cursor-pointer bg-red-300 text-white rounded-full flex justify-between italic"
          >
            {user.name}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchUser;
