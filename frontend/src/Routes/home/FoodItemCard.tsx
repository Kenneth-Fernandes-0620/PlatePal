import React, { forwardRef, useContext, useState } from 'react';
import { Button } from '@mui/material'; // Importing MUI Button

import { CartContext } from '../layout/CartContext';

// Use forwardRef to allow passing a ref to the component
const FoodItemCard = forwardRef<
  HTMLDivElement,
  { _id: string; title: string; summary: string; price: number }
>(({ _id, title, summary, price }, ref) => {
  const [count, setCount] = useState<number>(0);
  const [hover, setHover] = useState<boolean>(false);

  const cartContext = useContext(CartContext);

  if (!cartContext) {
    throw new Error('UserContext must be used within a UserProvider');
  }

  const { setCartInfo } = cartContext;

  const handleIncrement = () => {
    setCount((prevCount) => prevCount + 1);
    setCartInfo((prevCartInfo) => {
      prevCartInfo!.set(_id, (prevCartInfo!.get(_id) || 0) + 1);
      return new Map<string, number>(prevCartInfo);
    });
  };

  const handleDecrement = () => {
    if (count !== 0) {
      setCount((prevCount) => prevCount - 1);
      setCartInfo((prevCartInfo) => {
        if (prevCartInfo!.get(_id) === 1) {
          prevCartInfo!.delete(_id);
          return new Map<string, number>(prevCartInfo);
        } else {
          prevCartInfo!.set(_id, (prevCartInfo!.get(_id) || 0) - 1);
          return new Map<string, number>(prevCartInfo);
        }
      });
    }
  };

  const handleMouseEnter = () => setHover(true);
  const handleMouseLeave = () => setHover(false);

  // console.log(cartInfo?.size);

  let cleanedTitle = title.replace("_", ' ');
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
        src={`http://localhost:4000/food_images/${title}.jpg`}
        style={{
          borderRadius: '8px 8px 0px 0px', // Rounded corners (Parent Border Radius - Parent Border Width)
        }}
        width={'100%'}
        height={200}
        alt={title}
      />
      <div
        style={{
          paddingLeft: '10px',
          paddingRight: '10px',
        }}
      >
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
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
          style={{
            textAlign: 'left',
            marginTop: '0px',
            marginBottom: '10px',
          }}
        >
          {summary}
        </p>

        {/* Add to Cart Button */}
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
