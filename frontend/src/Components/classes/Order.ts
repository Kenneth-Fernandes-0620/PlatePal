import { FoodItem } from './FoodItem';

// Order Class
class Order {
  content: Map<FoodItem, number>;
  orderId: number;

  constructor(orderId: number) {
    this.orderId = orderId;
    this.content = new Map<FoodItem, number>();
  }

  addItem(foodItem: FoodItem, count: number): void {
    this.content.set(foodItem, count);
  }

  removeItem(foodItem: FoodItem): void {
    this.content.delete(foodItem);
  }
}

export { Order };
