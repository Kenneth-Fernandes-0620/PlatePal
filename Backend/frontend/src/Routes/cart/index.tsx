import React, { useContext } from 'react';
import {
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Button,
  Typography,
  ListItemAvatar,
  Avatar,
} from '@mui/material';
import { CartContext } from '../../Components/CartContext';
import { UserContext } from '../../Components/UserContext';

const Cart: React.FC = () => {
  const cartContext = useContext(CartContext);
  const userContext = useContext(UserContext);

  if (!cartContext || !userContext) {
    throw new Error('Context must be used within a ContextProvider');
  }

  const { cartInfo, setCartInfo } = cartContext;
  const { userInfo } = userContext;

  const handleRemoveItem = async (foodId: string) => {
    try {
      const response = await fetch(`${window.location.origin}/api/cart`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ foodId }),
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to remove item');
      }

      // Remove item from cart context
      setCartInfo((prevCartInfo) => {
        const newCartInfo = new Map(prevCartInfo);
        newCartInfo.delete(foodId); // Remove item by foodId
        return newCartInfo;
      });
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  // Calculate total items
  const totalItems = cartInfo
    ? Array.from(cartInfo.values()).reduce(
        (sum, [, quantity]) => sum + quantity,
        0,
      )
    : 0;

  const totalPrice = cartInfo
    ? Array.from(cartInfo.values()).reduce(
        (sum, [, quantity, price]) => sum + quantity * price,
        0,
      )
    : 0;

  const handlePayNow = async () => {
    try {
      // Gather order items from the cart
      const orderItems: {
        foodId: string;
        name: string;
        quantity: number;
        price: number;
      }[] = Array.from(cartInfo!.entries()).map(
        ([foodId, [name, quantity, price]]) => ({
          foodId,
          name,
          quantity,
          price,
        }),
      );

      const userId = userInfo?.id; // Ensure user ID is available

      const response = await fetch(`${window.location.origin}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, items: orderItems }),
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to place order');
      }

      // Clear the cart after successful order placement
      setCartInfo(new Map());
      alert('Order placed successfully!');
    } catch (error) {
      console.error('Error placing order:', error);
      alert('There was an issue placing your order. Please try again.');
    }
  };

  return (
    <div style={{ margin: '20px' }}>
      <Typography variant="h4" gutterBottom>
        Your Cart
      </Typography>
      <List>
        {cartInfo && cartInfo.size > 0 ? (
          Array.from(cartInfo.entries()).map(
            ([foodId, [name, quantity, price]]) => (
              <ListItem key={foodId}>
                <ListItemAvatar>
                  <Avatar
                    src={`${window.location.origin}/food_images/${name}.jpg`}
                    alt={name}
                  />
                </ListItemAvatar>
                <ListItemText
                  primary={name.charAt(0).toUpperCase() + name.slice(1)}
                  secondary={`Quantity: ${quantity} | Total: ₹${(quantity * price).toFixed(2)}`}
                />
                <ListItemSecondaryAction>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleRemoveItem(foodId)}
                  >
                    Remove
                  </Button>
                </ListItemSecondaryAction>
              </ListItem>
            ),
          )
        ) : (
          <Typography variant="body1">
            Your cart is empty, Add some more items
          </Typography>
        )}
      </List>
      {cartInfo && cartInfo.size > 0 && (
        <div style={{ marginTop: '20px' }}>
          <Typography variant="h6">
            Total Items: {totalItems} | Total Price: ₹{totalPrice.toFixed(2)}
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            onClick={handlePayNow}
            style={{ marginTop: '20px' }}
          >
            Pay Now
          </Button>
        </div>
      )}
    </div>
  );
};

export default Cart;
