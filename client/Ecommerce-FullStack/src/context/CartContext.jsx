import { createContext, useContext, useEffect, useState } from "react"
import { useUserContext } from "./UserContext"

export const CartContext = createContext()

export const useCartContext = () => {
  const context = useContext(CartContext)
  if(!context) {
    throw new Error("useCartContext must be used within an CartProvider")
  }
  return context
}

const CartProvider = ({ children }) => {

    const [ cart, setCart ] = useState([])
    const [ cartCount, setCartCount ] = useState(0)
    const [ cartTotalPrice, setCartTotalPrice ] = useState(0)
    const { user, token } = useUserContext()

    const cleanCart = () => {
        setCart([])
        setCartCount(0)
        setCartTotalPrice(0)
    }

    console.log(user)
    //console.log(token)
    //console.log("carrito id de user", user.cart)
   
    useEffect(() => {
      if (user && user.cart) {
        const fetchCart = async () => {
          const requestOptions = {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            credentials: "include",
          };
  
          try {
            const response = await fetch(`http://localhost:4000/api/carts/${user.cart}`, requestOptions);
            if (!response.ok) {
              const data = await response.json();
              console.error(`Error al obtener el carrito: ${data.message}`);
              return;
            }
  
            const data = await response.json();
            setCart(data.payload);
            console.log("data pyload", data.payload)
          } catch (error) {
            console.error("Error al obtener el carrito:", error);
          }
        };
  
        fetchCart();
      }
    }, [user, token]);

  return (
    <CartContext.Provider value={{
      cleanCart,
      cart,
      setCart,
      cartCount,
      cartTotalPrice,
    }}>
      {children}
    </CartContext.Provider>
  )
}

export default CartProvider