import './starRating.css';

export default function StarRating({ stars }: { stars: number }) {
  return (
    <span className="star-rating">
      {[1, 2, 3, 4, 5].map(i => <span key={i}>{stars >= i ? '★' : '☆'}</span>)}
    </span>
  );
}
