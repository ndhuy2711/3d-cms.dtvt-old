import { createContext } from "react";

export const AppContext = createContext({});
export const AppProvider = ({ children }) => {
  const authToken = localStorage.getItem("dtvt");;
  const isLoginFC = () => {
    if (authToken) {
      return true;
    } else {
      return false;
    }
  };
  const isLogin = isLoginFC();
  return (
    <AppContext.Provider value={{ isLogin }}>{children}</AppContext.Provider>
  );
};
