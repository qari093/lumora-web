import Link from "next/link";
import { listReviews } from "@/src/core/zendoro/api/store";

export default function ZendoroReviewsView() {
  const reviews = listReviews();

  return (
    <main aria-label="Zendoro reviews" style={{ padding: 24 }}>
      <h1>Reviews</h1>
      {reviews.length === 0 ? (
        <p>No reviews yet.</p>
      ) : (
        <ul>
          {reviews.map((review) => (
            <li key={review.id}>
              {review.rating}/5 — {review.comment ?? "No comment"}
            </li>
          ))}
        </ul>
      )}
      <Link href="/zendoro">Back to marketplace</Link>
    </main>
  );
}
