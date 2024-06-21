import {createContext, useEffect, useState} from "react";
import axios from "axios";

export const UserContext = createContext({});

export function UserContextProvider({children}) {
  const [username, setUsername] = useState(null);
  const [id, setId] = useState(null);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const { data } = await axios.get('/profile');
        setId(data.userId);
        setUsername(data.username);
      } catch (error) {
        console.log("No token found or session expired.");
      }
    }
    fetchProfile();
  }, []);

  return (
    <UserContext.Provider value={{ username, setUsername, id, setId }}>
      {children}
    </UserContext.Provider>
  );
}