export type Review = {
  id: string;
  rating: number;
  verified: boolean;
};

const reviews: Review[] = [];

export function addReview(rating: number, verified = false) {
  const review: Review = {
    id: crypto.randomUUID(),
    rating,
    verified,
  };

  reviews.push(review);

  return review;
}

export function getAverageRating() {
  if (!reviews.length) return 0;

  return (
    reviews.reduce((sum, item) => sum + item.rating, 0) / reviews.length
  );
}

export function getVerifiedRatio() {
  if (!reviews.length) return 0;

  return reviews.filter((r) => r.verified).length / reviews.length;
}
