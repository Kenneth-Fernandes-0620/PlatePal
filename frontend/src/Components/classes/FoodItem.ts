import { Category } from './Category';

class FoodItem {
  id: string;
  name: string;
  description: string;
  url: string;
  category: Category;
  review_id: string;
  stock_availability: number;
  cost: number;

  constructor(
    id: string,
    name: string,
    description: string,
    url: string,
    category: Category,
    review_id: string,
    stock_availability: number,
    cost: number,
  ) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.url = url;
    this.category = category;
    this.review_id = review_id;
    this.stock_availability = stock_availability;
    this.cost = cost;
  }
}

export { FoodItem };
