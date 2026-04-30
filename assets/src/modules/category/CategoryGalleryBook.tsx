import '../../common/styles/gallery.css';
import StarRating from '../../common/starRating/StarRating';
import AddToCart from '../../common/AddToCart';
import { Book } from '../bestSellers/BestSellerProductRow';

export default function CategoryGalleryBook({ book }: { book: Book }) {
  if (!book) return null;
  return (
    <div className="col-sm-3 col-md-3">
      <div className="thumbnail no-border">
        <p className="rating-container"><StarRating stars={book.rating} /><span className="float-end">{`$${book.price}`}</span></p>
        <img src={book.cover} alt={`${book.name} cover`} />
        <div className="caption">
          <h4 className="text-center">{book.name}</h4>
          <AddToCart bookId={book.id} price={book.price} variant="center" />
        </div>
      </div>
    </div>
  );
}
