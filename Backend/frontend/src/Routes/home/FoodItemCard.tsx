import React, { forwardRef, useContext, useState } from 'react';
import { Button } from '@mui/material';
import { CartContext } from '../../Components/CartContext';
import { UserContext } from '../../Components/UserContext';
import { useNavigate } from 'react-router-dom';

const FoodItemCard = forwardRef<
  HTMLDivElement,
  { _id: string; title: string; summary: string; price: number }
>(({ _id, title, summary, price }, ref) => {
  const cartContext = useContext(CartContext);
  const userContext = useContext(UserContext);
  if (!cartContext || !userContext) {
    throw new Error('Context must be used within a Provider');
  }

  const { cartInfo, setCartInfo } = cartContext;
  const { userInfo } = userContext;

  const [hover, setHover] = useState<boolean>(false);
  const count = cartInfo?.get(_id)?.[1] || 0; // Directly use cart value as quantity

  const navigate = useNavigate();

  const handleIncrement = async () => {
    if (!userInfo?.email) {
      alert('Please login to add items to cart');
      navigate('/login');
      return;
    }

    const newCount = count + 1;
    setCartInfo((prevCartInfo) => {
      prevCartInfo!.set(_id, [title, newCount, price]); // Update with new quantity
      return new Map<string, [string, number, number]>(prevCartInfo);
    });

    // Make a request to the server to add the item to the user's cart
    try {
      const response = await fetch(`${window.location.origin}/api/cart`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: title,
          foodId: _id,
          quantity: 1,
          price,
        }),
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
    } catch (error) {
      console.error('Error adding item to cart:', error);
      // Revert the cart context change
      setCartInfo((prevCartInfo) => {
        prevCartInfo!.set(_id, [title, count, price]); // Reset to previous count
        return new Map<string, [string, number, number]>(prevCartInfo);
      });
    }
  };

  const handleDecrement = async () => {
    if (count > 0) {
      const newCount = count - 1;

      setCartInfo((prevCartInfo) => {
        if (newCount <= 0) {
          prevCartInfo!.delete(_id); // Remove from cart
        } else {
          prevCartInfo!.set(_id, [title, newCount, price]);
        }
        return new Map<string, [string, number, number]>(prevCartInfo);
      });

      // Make a request to the server
      try {
        if (newCount === 0) {
          // Call delete endpoint if count is 0
          const response = await fetch(`${window.location.origin}/api/cart`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              foodId: _id,
            }),
            credentials: 'include',
          });

          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
        } else {
          // Otherwise update the quantity
          const response = await fetch(`${window.location.origin}/api/cart`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              name: title,
              foodId: _id,
              quantity: -1, // Decrementing the quantity
            }),
            credentials: 'include',
          });

          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
        }
      } catch (error) {
        console.error('Error updating item in cart:', error);
        // Revert the cart context change if there's an error
        setCartInfo((prevCartInfo) => {
          prevCartInfo!.set(_id, [title, count, price]); // Reset to previous count
          return new Map<string, [string, number, number]>(prevCartInfo);
        });
      }
    }
  };

  const handleMouseEnter = () => setHover(true);
  const handleMouseLeave = () => setHover(false);

  let cleanedTitle = title.replace('_', ' ');
  cleanedTitle = cleanedTitle.charAt(0).toUpperCase() + cleanedTitle.slice(1);

  return (
    <div
      ref={ref}
      key={_id}
      style={{
        border: '2px solid black',
        borderRadius: '10px',
        paddingBottom: '10px',
        width: '300px',
        marginBottom: '20px',
        boxShadow: '0px 0px 5px #000',
      }}
    >
      <img
        src={`${window.location.origin}/food_images/${title}.jpg`}
        style={{
          borderRadius: '8px 8px 0px 0px',
        }}
        width={'100%'}
        height={200}
        alt={title}
      />
      <div style={{ paddingLeft: '10px', paddingRight: '10px' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <p
            style={{
              textAlign: 'left',
              fontWeight: 'bold',
              marginTop: '10px',
              marginBottom: '5px',
            }}
          >
            {cleanedTitle}
          </p>
          <p>₹{price}</p>
        </div>
        <p
          style={{ textAlign: 'left', marginTop: '0px', marginBottom: '10px' }}
        >
          {summary}
        </p>

        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            marginTop: '10px',
          }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {!hover && count === 0 ? (
            <Button
              variant="contained"
              color="primary"
              onClick={handleIncrement}
            >
              Add to Cart
            </Button>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleDecrement}
              >
                -
              </Button>
              <span
                style={{
                  margin: '0 10px',
                  fontSize: '18px',
                  fontWeight: 'bold',
                }}
              >
                {count}
              </span>
              <Button
                variant="contained"
                color="primary"
                onClick={handleIncrement}
              >
                +
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

// Setting displayName for better debugging
FoodItemCard.displayName = 'FoodItem';

export default FoodItemCard;
