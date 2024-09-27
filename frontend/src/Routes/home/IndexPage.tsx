import React from "react";
// import FoodItem from "./FoodItem";
import { useEffect, useState } from "react";
import SearchIcon from '@mui/icons-material/Search';
import { IconButton } from "@mui/material";

const styles = {
  form: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    margin: '20px',
  },
  input: {
    width: '300px',
    padding: '10px 20px',
    fontSize: '16px',
    border: '2px solid #ddd',
    borderRadius: '25px',
    outline: 'none',
    transition: 'all 0.3s ease',
  },
  inputFocus: {
    borderColor: '#4a90e2',
  },
  button: {
    backgroundColor: '#4a90e2',
    color: '#fff',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '25px',
    cursor: 'pointer',
    fontSize: '16px',
    marginLeft: '10px',
  },
  buttonHover: {
    backgroundColor: '#357ABD',
  },
};

const categories = [
  { name: 'All', image: 'AllCategories', count: 10, color: '#FEEFEA' },
  { name: 'Vegetables', image: 'vegetables_categories', count: 10 },
  { name: 'Fruit', image: 'fruits_categories', count: 10 },
  { name: 'Non-veg', image: 'nonveg_categories', count: 10 },
  { name: 'Breads', image: 'BreadCategories', count: 10 },
  { name: 'Dairy', image: 'DairyCategories', count: 10 },
  { name: 'Other', image: 'OtherCategories', count: 10 },
];

export default function IndexPage() {
  // const [posts, setPosts] = useState([]);
  const [query, setQuery] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Searching for:', query);
    // Perform search action or call an API here
  };

  useEffect(() => {

  }, []);

  return (
    <div>

      {/* // Search Bar */}
      <form onSubmit={handleSearch} style={styles.form}>
        <input
          type="text"
          placeholder="Search for Food Item"
          value={query}
          onChange={handleInputChange}
          style={styles.input}
        />
        <IconButton aria-label="search">
          <SearchIcon />
        </IconButton>
      </form>

      {/* Explore Categories */}
      <h2 style={{ margin: '20px' }}>Explore Categories</h2>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          gap: 20,
          padding: 10,
        }}
      >
        {
          categories.map(category => (
            <div key={category.name} style={{ textAlign: 'center', backgroundColor: '#FEEFEA', paddingLeft: 5, paddingRight: 5, border: '1px solid black', boxShadow: '1px 0px black', borderRadius: 10 }}>
              <img src={`http://localhost:4000/${category.image}.png`} width={80} height={80} />
              <p style={{ marginBottom: '0px', fontWeight: 'bold', marginTop: '10px' }}>{category.name}</p>
              <p style={{ marginTop: '0px' }}>{category.count}</p>
            </div>
          ))
        }

      </div>


      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gridGap: 20,
          padding: 20,
        }}
      >
        {
          [1, 2, 3, 4, 5].map(post => (
            <img key={post} src={'https://media.istockphoto.com/id/517188688/photo/mountain-landscape.jpg?s=612x612&w=0&k=20&c=A63koPKaCyIwQWOTFBRWXj_PwCrR4cEoOw2S9Q7yVl8='}
              width={200} height={200}
            />
          ))
        }
      </div>
    </div>
  );
}