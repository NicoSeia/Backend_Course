import { createContext, useContext, useEffect, useState } from 'react'

export const UserContext = createContext()

const tokenPrevio = JSON.parse(localStorage.getItem("token"))
const userPrevio = JSON.parse(localStorage.getItem("user"))

export const useUserContext = () => {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error("useUserContext must be used within an UserProvider")
  }
  return context
};

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(userPrevio || {})
  const [token, setToken] = useState(tokenPrevio || '')

  useEffect (() => {
    localStorage.setItem("token", JSON.stringify(token))
    localStorage.setItem("user", JSON.stringify(user))
  }, [token, user])



  return (
    <UserContext.Provider value={{
      user,
      setUser,
      token,
      setToken
    }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider
