import { createContext, useState, useEffect, useCallback } from "react";
import { getProfile } from "../helpers/auth.js";

const UserContext = createContext(null);

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);

  const loadUserData = useCallback(async () => {
    setIsLoadingUser(true);
    try {
      const response = await getProfile();
      let nextUser = null;

      if (response.ok && response.data) {
        nextUser =
          response.data.usuario ||
          response.data.user ||
          response.data.data ||
          response.data;
      }
      setUser(nextUser);
      return nextUser;
    } catch (error) {
      console.error("Error al cargar perfil:", error);
      setUser(null);
      return null;
    } finally {
      setIsLoadingUser(false);
    }
  }, []);

  useEffect(() => {
    loadUserData();
  }, [loadUserData]);

  const clearUserData = () => {
    setUser(null);
    setIsLoadingUser(false);
  };

  return (
    <UserContext.Provider value={{ user, loadUserData, clearUserData, isLoadingUser }}>
      {children}
    </UserContext.Provider>
  );
};

export { UserProvider, UserContext };
