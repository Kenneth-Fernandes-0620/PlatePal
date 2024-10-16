import React, { useEffect } from 'react';
// import FoodItem from "./FoodItem";
import { useState, useRef, useCallback } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import { IconButton } from '@mui/material';

import FoodItemCard from './FoodItemCard';
import CategoryItem from './CategoryItem';
import { Category } from '../../Components/classes/Category';

import externalStyles from './styles.module.css';

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
    border: '2px solid #000',
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
  {
    name: 'All',
    image: 'all_categories',
    color: '#FEEFEA',
    category: Category.All,
  },
  {
    name: 'Vegetable',
    image: 'vegetables_categories',
    category: Category.Vegetable,
  },
  {
    name: 'Fruit',
    image: 'fruits_categories',
    category: Category.Fruit,
  },
  {
    name: 'Non-veg',
    image: 'nonveg_categories',
    category: Category.NonVeg,
  },
  {
    name: 'Breads',
    image: 'bread_categories',
    category: Category.Breads,
  },
  {
    name: 'Dairy',
    image: 'dairy_categories',
    category: Category.Dairy,
  },
  {
    name: 'Others',
    image: 'other_categories',
    category: Category.Others,
  },
];

interface FoodItem {
  _id: string;
  id: string;
  name: string;
  description: string;
  category: string;
  stock: number;
  cost: number;
}

const MAX_ITEMS_PER_LOAD = 10;

export default function IndexPage() {
  // const [posts, setPosts] = useState([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [foodItems, setFoodItems] = useState<FoodItem[] | null>(null);

  const [error, setError] = useState(false);

  const [hasMore, setHasMore] = useState<boolean>(true);
  const [page, setPage] = useState(1);

  const [categoryFilter, setCategoryFilter] = useState<Category>(Category.All);

  const [categoryCount, setCategoryCount] = useState<Map<string, number>>(
    new Map<string, number>(),
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Searching for:', query);
    // Perform search action or call an API here
  };

  const observer = useRef<IntersectionObserver | null>(null);
  const lastFoodElementRef = useCallback(
    (node: HTMLDivElement) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          setPage(page + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading],
  );

  // Load the food categories Count on the first render
  useEffect(() => {
    fetch(`${window.location.origin}/api/foodCategories`, {
      credentials: 'include',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        response.json().then((data) => {
          const categoryCountMap = new Map<string, number>();
          let categoryAll = 0;
          data.forEach((category: { category: string; count: number }) => {
            categoryCountMap.set(category.category, category.count);
            categoryAll += category.count;
          });
          categoryCountMap.set('all', categoryAll);
          setCategoryCount(categoryCountMap);
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    if (!hasMore) return;

    setLoading(true);
    fetch(
      `${window.location.origin}/api/food?page=${page}&limit=${MAX_ITEMS_PER_LOAD}`,
      {
        credentials: 'include',
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    )
      .then((response) => {
        response.json().then((data) => {
          if (data.length === 0) {
            setHasMore(false);
            setLoading(false);
            return;
          }

          if (foodItems == null) {
            setFoodItems(data);
          } else {
            setFoodItems((prevFoodItems) => [...prevFoodItems!, ...data]);
          }
          setLoading(false);
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }, [page]);

  return (
    <div style={{}}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {/* // Search Bar */}
        <form onSubmit={handleSearch} style={styles.form}>
          <input
            type="text"
            placeholder="Search for Food Item"
            value={query}
            onChange={handleInputChange}
            style={styles.input}
          />
          <IconButton aria-label="search" onClick={handleSearch}>
            <SearchIcon />
          </IconButton>
        </form>
      </div>

      {/* Explore Categories */}
      <h2 style={{ margin: '20px' }}>Explore Categories</h2>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-around',
          gap: 20,
          padding: 10,
        }}
      >
        {categories.map((category) => (
          <CategoryItem
            key={category.name}
            name={category.name}
            image={category.image}
            count={categoryCount.get(category.name.toLowerCase()) ?? 0}
            setCategoryFilter={setCategoryFilter}
            category={category.category}
          />
        ))}
      </div>

      <div className={externalStyles.foodItemsGrid}>
        {foodItems &&
        foodItems
          .filter(
            (foodItem) =>
              categoryFilter === 'All' ||
              foodItem.category === categoryFilter.toString().toLowerCase(),
          )
          .filter((foodItem) =>
            foodItem.name.toLowerCase().includes(query.toLowerCase()),
          ).length === 0 ? (
          <h1>No Items Found</h1>
        ) : (
          foodItems
            ?.filter(
              (foodItem) =>
                categoryFilter === 'All' ||
                foodItem.category ===
                  categoryFilter.toString().toLocaleLowerCase(),
            )
            .filter((foodItem) =>
              foodItem.name.toLowerCase().includes(query.toLowerCase()),
            )
            .map((foodItem, index) => {
              if (index === foodItems.length - 1) {
                return (
                  <FoodItemCard
                    key={foodItem._id}
                    _id={foodItem._id}
                    title={foodItem.name}
                    summary={foodItem.description}
                    price={foodItem.cost}
                    stock={foodItem.stock}
                  />
                );
              } else {
                return (
                  <FoodItemCard
                    ref={lastFoodElementRef}
                    key={foodItem._id}
                    _id={foodItem._id}
                    title={foodItem.name}
                    summary={foodItem.description}
                    price={foodItem.cost}
                    stock={foodItem.stock}
                  />
                );
              }
            })
        )}
      </div>
    </div>
  );
}
