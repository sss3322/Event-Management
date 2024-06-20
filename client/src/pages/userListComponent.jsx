import React, { useState, useEffect } from "react";
import axios from 'axios';

const UserListComponent = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Fetch users from the backend
    axios.get("/users")
      .then(response => {
        // Filter out non-admin users (assuming isAdmin is boolean)
        const nonAdminUsers = response.data.filter(user => !user.isAdmin);
        setUsers(nonAdminUsers);
      })
      .catch(error => {
        console.error("Error fetching users:", error);
      });
  }, []);

  return (
    <div>
      <h2 className="text-xl font-bold ml-4 mb-4">  Users</h2>
      <div className="grid grid-cols-1 gap-4">
        {users.map(user => (
          <div key={user.id} className="bg-white p-4 shadow-md rounded-md">
            <div className="text-lg text-green-600 font-bold">{user.name}</div>
            <div className="text-gray-600">{user.email}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserListComponent;
