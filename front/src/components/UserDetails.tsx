import React from "react";

interface UserDetailsProps {
  user: any;
}

const UserDetails: React.FC<UserDetailsProps> = ({ user }) => {
  if (!user) return null;

  return (
    <div className="p-4 flex items-center">
      <div className="bg-gray-500 rounded-full text-white h-12 w-12 flex items-center justify-center text-xl">
        {user.name[0].toUpperCase()}
      </div>
      <div className="ml-4">
        <div className="font-bold text-4xl text-black">{user.name}</div>
      </div>
    </div>
  );
};

export default UserDetails;
