import React, { useContext, useEffect, useState } from 'react';
import {
  Typography,
  List,
  ListItem,
  ListItemText,
  Avatar,
  ListItemAvatar,
} from '@mui/material';
import { UserContext } from '../../Components/UserContext';
import { useNavigate } from 'react-router-dom';

/**
 * The interface for the order item
 */
interface OrderItem {
  foodId: string;
  name: string;
  quantity: number;
  price: number;
}

/**
 * The interface for the order
 */
interface Order {
  _id: string;
  items: OrderItem[];
  totalAmount: number;
  createdAt: string;
}

/**
 * The Component to display the orders of the user
 * @returns JSX Element
 */
const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);

  const navigate = useNavigate();

  const context = useContext(UserContext);

  if (!context) {
    throw new Error('SomeComponent must be used within a UserContextProvider');
  }

  const { userInfo } = context;

  useEffect(() => {
    const fetchOrders = async () => {
      const response = await fetch('http://localhost:4000/orders', {
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      } else {
        console.error('Failed to fetch orders');
      }
    };

    // if user is not logged in, they should log in first and then they will be redirected to view their orders
    if (userInfo == null) {
      navigate('/login', {
        state: { redirect: '/orders' },
      });
      return;
    }

    fetchOrders();
  }, []);

  return (
    <div style={{ margin: '20px' }}>
      <Typography variant="h4" gutterBottom>
        Your Orders
      </Typography>
      {orders.length > 0 ? (
        <List>
          {orders.map((order) => (
            <ListItem key={order._id}>
              <ListItemText
                primary={`Order ID: ${order._id}`}
                secondary={`Date: ${new Date(order.createdAt).toLocaleDateString()}`}
              />
              <ul>
                {order.items.map((item) => (
                  <li key={item.foodId}>
                    {item.name} (x{item.quantity}) - ₹
                    {(item.price * item.quantity).toFixed(2)}
                  </li>
                ))}
              </ul>
            </ListItem>
          ))}
        </List>
      ) : (
        <Typography variant="body1">You have no orders yet.</Typography>
      )}
    </div>
  );
};

export default Orders;
