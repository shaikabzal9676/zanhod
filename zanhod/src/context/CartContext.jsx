import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {

  const [cartItems, setCartItems] = useState(() => {

    const savedCart = localStorage.getItem("zanhod-cart");

    return savedCart
      ? JSON.parse(savedCart)
      : [];

  });


  /* =========================================
     SAVE CART
  ========================================= */

  useEffect(() => {

    localStorage.setItem(
      "zanhod-cart",
      JSON.stringify(cartItems)
    );

  }, [cartItems]);


  /* =========================================
     ADD TO CART
  ========================================= */

  const addToCart = (product, size, quantity = 1) => {

    setCartItems((currentItems) => {

      const existingItem = currentItems.find(
        (item) =>
          item.id === product.id &&
          item.size === size
      );


      if (existingItem) {

        return currentItems.map((item) =>
          item.id === product.id &&
          item.size === size
            ? {
                ...item,
                quantity: item.quantity + quantity
              }
            : item
        );

      }


      return [
        ...currentItems,
        {
          ...product,
          size,
          quantity
        }
      ];

    });

  };


  /* =========================================
     REMOVE FROM CART
  ========================================= */

  const removeFromCart = (productId, size) => {

    setCartItems((currentItems) =>
      currentItems.filter(
        (item) =>
          !(
            item.id === productId &&
            item.size === size
          )
      )
    );

  };


  /* =========================================
     UPDATE QUANTITY
  ========================================= */

  const updateQuantity = (
    productId,
    size,
    quantity
  ) => {

    if (quantity < 1) {
      return;
    }


    setCartItems((currentItems) =>
      currentItems.map((item) =>
        item.id === productId &&
        item.size === size
          ? {
              ...item,
              quantity
            }
          : item
      )
    );

  };


  /* =========================================
     CLEAR CART
  ========================================= */

  const clearCart = () => {
    setCartItems([]);
  };


  /* =========================================
     TOTAL ITEMS
  ========================================= */

  const totalItems = cartItems.reduce(
    (total, item) =>
      total + item.quantity,
    0
  );


  /* =========================================
     SUBTOTAL
  ========================================= */

  const subtotal = cartItems.reduce(
    (total, item) =>
      total + item.price * item.quantity,
    0
  );


  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        subtotal
      }}
    >
      {children}
    </CartContext.Provider>
  );
}


/* =========================================
   CUSTOM HOOK
========================================= */

export function useCart() {

  return useContext(CartContext);

}