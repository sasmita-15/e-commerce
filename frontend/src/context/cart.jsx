/* eslint-disable react-refresh/only-export-components */


import { useState, useContext, createContext, useEffect } from "react";

export const CartContext = createContext(null);
export const CartProvider = (props) => {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    let existingCartItem = localStorage.getItem("cart");
    if (existingCartItem) setCart(JSON.parse(existingCartItem));
  }, []);

  return (
    <CartContext.Provider value={{cart, setCart}}>
      {props}
    </CartContext.Provider>
  );
};

// custom hook
export const useCart = () => {
  const cartContext = useContext(CartContext)
  return cartContext
};
