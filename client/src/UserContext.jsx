import { createContext, useEffect, useState } from "react";
import axios from 'axios';

export const UserContext = createContext({});

export function UserContextProvider({ children }) {
  const [user, setUser] = useState(null); // Initialize user state
  const [isAdmin, setIsAdmin] = useState(false); // Initialize isAdmin state

  useEffect(() => {
    fetchProfile(); // Fetch user profile on component mount
  }, []); // Empty dependency array ensures it runs once on mount

  const fetchProfile = async () => {
    try {
      const response = await axios.get('/profile');
      console.log(response); // Check the entire response object for debugging
      
      if (!response.data) {
        console.error("Empty response received from server.");
        return;
      }
      
      setUser(response.data); // Set the 'user' state with the received data
      
      if (response.data.isAdmin !== undefined) {
        setIsAdmin(response.data.isAdmin); 
        console.log(isAdmin)// Set the 'isAdmin' state based on 'isAdmin' field in 'data'
      } else {
        console.error("isAdmin field is missing in the fetched data.");
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };
  
  return (
    <UserContext.Provider value={{ user, setUser, isAdmin, setIsAdmin }}>
      {children}
    </UserContext.Provider>
  );
}
