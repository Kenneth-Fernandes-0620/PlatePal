import { FoodItem } from './FoodItem';

class Cart {
  content: Map<FoodItem, number>;

  constructor() {
    this.content = new Map<FoodItem, number>();
  }

  addItem(foodItem: FoodItem, count: number): void {
    this.content.set(foodItem, count);
  }

  removeItem(foodItem: FoodItem): void {
    this.content.delete(foodItem);
  }
}

export { Cart };
