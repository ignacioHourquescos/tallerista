// CartContext.tsx
import { Article } from '@/application/models/order';
import React, { useState, createContext, useContext, useEffect } from 'react';

interface CartContextType {
  cartItems: Article[];
  addToCart: (newItem: Article) => void;
  removeFromCart: (articleId: string) => void;
  modifyQuantity: (articleId: string, quantity: number) => void;
  emptyCart: () => void;
  countItemsInCart: () => void;
  initializeCart: () => void;
  currentOrder: boolean;
  cartIsVisible: boolean; // New state for cart visibility
  setCartIsVisible: (isVisible: boolean) => void; // Setter for cart visibility
}

const initialCart: Article[] = [];

const initialContext: CartContextType = {
  cartItems: initialCart,
  addToCart: () => {},
  removeFromCart: () => {},
  modifyQuantity: () => {},
  emptyCart: () => {},
  countItemsInCart: () => {},
  initializeCart: () => {},
  currentOrder: true,
  cartIsVisible: false, // Initialize cart visibility state
  setCartIsVisible: () => {}, // Placeholder for setter
};
export const CartContext = createContext<CartContextType>(initialContext);

interface IGlobalProvider {
  children: React.ReactNode;
}

export const CartProvider: React.FC<IGlobalProvider> = ({ children }) => {
  // Initialize cart items state - siempre empezar vacío
  const [cartItems, setCartItems] = useState<Article[]>([]);

  const [currentOrder, setCurrentorder] = useState<boolean>(true);
  const [cartIsVisible, setCartIsVisibleState] = useState<boolean>(false);

  const addToCart = (newItem: Article) => {
    const existingArticleIndex = cartItems.findIndex(
      (article) => article.id.toLowerCase() === newItem.id.toLowerCase()
    );

    if (existingArticleIndex !== -1) {
      // If the article already exists, update its quantity
      setCartItems((prevItems) =>
        prevItems.map((article, index) =>
          index === existingArticleIndex
            ? { ...article, quantity: article.quantity + newItem.quantity }
            : article
        )
      );
    } else {
      // If the article doesn't exist, add it to the cart with the given quantity
      setCartItems((prevItems) => [...prevItems, newItem]);
    }
  };

  // Limpiar localStorage al montar para empezar con carrito vacío
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('cartItems');
    }
  }, []);

  // Guardar en localStorage cuando cambia cartItems
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  // Listener para sincronizar cambios de localStorage desde otras pestañas/dispositivos
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'cartItems') {
        try {
          const newCartItems = e.newValue ? JSON.parse(e.newValue) : [];
          setCartItems(newCartItems);
        } catch (error) {
          console.error('Error parsing cartItems from storage event:', error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const removeFromCart = (articleId: string) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => item.id !== articleId)
    );
  };

  const modifyQuantity = (articleId: string, quantity: number) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === articleId ? { ...item, quantity } : item
      )
    );
  };

  const initializeCart = () => {
    setCurrentorder(true);
  };

  const emptyCart = () => {
    localStorage.removeItem('cartItems');
    setCartItems([]);
    setCurrentorder(false);
  };
  const setCartIsVisible: CartContextType['setCartIsVisible'] = (isVisible) => {
    setCartIsVisibleState(isVisible);
  };

  const countItemsInCart = () => {
    let totalQuantity = 0;
    for (const item of cartItems) {
      totalQuantity += item.quantity;
    }
    return totalQuantity;
  };

  const contextValue: CartContextType = {
    cartItems,
    addToCart,
    removeFromCart,
    modifyQuantity,
    emptyCart,
    countItemsInCart,
    initializeCart,
    currentOrder,
    cartIsVisible,
    setCartIsVisible, // Use the actual setter function
  };

  return (
    <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>
  );
};
