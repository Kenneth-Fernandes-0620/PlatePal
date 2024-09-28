import React, { useEffect } from "react";
import { createContext, useState, ReactNode } from "react";


interface CartContextProviderProps {
    children: ReactNode;
}

interface CartContextType {
    cartInfo: Map<string, number> | null;
    setCartInfo: React.Dispatch<React.SetStateAction<Map<string, number> | null>>;
}

export const CartContext = createContext<CartContextType | undefined>(undefined);;

export function CartContextProvider({ children }: CartContextProviderProps) {
    const [cartInfo, setCartInfo] = useState<Map<string, number> | null>(null);

    // Fetch the cart data from the server
    useEffect(() => {
        // const loadCartData = async () => {
        //     try {
        //         const response = await fetch('http://localhost:5000/cart', {
        //             credentials: 'include',
        //         });

        //         if (!response.ok) {
        //             throw new Error('Failed to fetch cart data');
        //         }

        //         const data = await response.json();

        //         // Assuming `data` contains the count and items in a similar format
        //         const itemsMap = new Map<string, number>(Object.entries(data.items));

        //         setCartInfo(
        //             itemsMap    // items in the cart, assuming data.items is an object {itemId: quantity}
        //         );
        //     } catch (error) {
        //         console.error('Error fetching cart data:', error);
        //     }
        // };

        // loadCartData();
        setCartInfo(new Map<string, number>());
    }, []);



    return (
        <CartContext.Provider value={{ cartInfo, setCartInfo }}>
            {children}
        </CartContext.Provider>
    );
}
