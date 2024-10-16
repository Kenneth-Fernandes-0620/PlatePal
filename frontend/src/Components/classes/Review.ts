// Review Class
class Review {
  reviewId: string;
  reviews: string[];
  review_star: number;
  userId: string;

  constructor(
    reviewId: string,
    reviews: string[],
    review_star: number,
    userId: string,
  ) {
    this.reviewId = reviewId;
    this.reviews = reviews;
    this.review_star = review_star;
    this.userId = userId;
  }
}

export { Review };
