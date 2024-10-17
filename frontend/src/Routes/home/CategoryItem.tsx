import React, { useState } from 'react';
import { Category } from '../../Components/classes/Category';

const host =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:4000'
    : window.location.origin;

export default function CategoryItem({
  name,
  image,
  count,
  category,
  setCategoryFilter,
  currentCategory,
}: {
  name: string;
  image: string;
  count: number;
  category: Category;
  setCategoryFilter: React.Dispatch<React.SetStateAction<Category>>;
  currentCategory: Category;
}) {
  const [hover, setHover] = useState(false);

  const style: React.CSSProperties = {
    textAlign: 'center',
    backgroundColor: 'rgba(254, 239, 234, 1)',
    paddingLeft: 5,
    paddingRight: 5,
    border: '1px solid black',
    borderColor: currentCategory === category ? 'red' : 'black',
    boxShadow: '0px 0px 10px #000',
    transform: hover ? 'scale(1.2)' : 'scale(1)',
    borderRadius: 10,
    cursor: 'pointer' /* Change cursor to hand */,
  };

  return (
    <div
      className="categoryItem"
      style={style}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={() => setCategoryFilter(category)}
    >
      <img src={`${host}/Assets/${image}.png`} width={80} height={80} />
      <p style={{ marginBottom: '0px', fontWeight: 'bold', marginTop: '10px' }}>
        {name}
      </p>
      <p style={{ marginTop: '0px' }}>{count}</p>
    </div>
  );
}
