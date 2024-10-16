import React, {
  useContext,
  useEffect,
  createContext,
  useState,
  ReactNode,
} from 'react';
import { UserContext } from './UserContext';

interface CartContextProviderProps {
  children: ReactNode;
}

interface CartContextType {
  cartInfo: Map<string, [string, number, number]> | null; // id: [name, quantity, price]
  setCartInfo: React.Dispatch<
    React.SetStateAction<Map<string, [string, number, number]> | null>
  >;
}

export const CartContext = createContext<CartContextType | undefined>(
  undefined,
);

export function CartContextProvider({ children }: CartContextProviderProps) {
  const [cartInfo, setCartInfo] = useState<Map<
    string,
    [string, number, number]
  > | null>(null);

  const userContext = useContext(UserContext);
  if (!userContext) {
    throw new Error('UserContext must be used within a UserContextProvider');
  }

  const { userInfo } = userContext;

  // Fetch the cart data from the server
  useEffect(() => {
    const loadCartData = async () => {
      try {
        const response = await fetch(`${window.location.origin}/api/cart`, {
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('Failed to fetch cart data');
        }

        const data = await response.json();
        const itemsMap = new Map<string, [string, number, number]>();

        data.forEach(
          (item: {
            foodId: { _id: string };
            quantity: number;
            name: string;
            price: number;
          }) => {
            itemsMap.set(item.foodId._id, [
              item.name,
              item.quantity,
              item.price,
            ]);
          },
        );

        setCartInfo(itemsMap);
      } catch (error) {
        console.error('Error fetching cart data:', error);
      }
    };

    if (userInfo?.email) loadCartData();
  }, [userInfo]);

  return (
    <CartContext.Provider value={{ cartInfo, setCartInfo }}>
      {children}
    </CartContext.Provider>
  );
}
