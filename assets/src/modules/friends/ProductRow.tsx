import { useState, useEffect } from 'react';
import { get } from 'aws-amplify/api';
import '../../common/styles/productRow.css';
import StarRating from '../../common/starRating/StarRating';
import AddToCart from '../../common/AddToCart';
import FriendRecommendations from '../../common/friendRecommendations/FriendRecommendations';
import { Book } from '../bestSellers/BestSellerProductRow';

export function ProductRow({ bookId }: { bookId: string }) {
  const [book, setBook] = useState<Book | undefined>();

  useEffect(() => {
    (async () => {
      try {
        const res = await get({ apiName: 'books', path: `/books/${bookId}` }).response;
        setBook(await res.body.json() as any);
      } catch (e) { alert(e); }
    })();
  }, [bookId]);

  if (!book) return null;
  return (
    <div className="white-box">
      <div className="media">
        <div className="media-left media-middle no-padding">
          <img className="product-thumb border" src={book.cover} alt={`${book.name} cover`} />
        </div>
        <div className="media-body product-padding padding-20">
          <h3 className="media-heading">{book.name}<small className="float-end">${book.price}</small></h3>
          <p className="no-margin"><small>{book.category}</small></p>
          <FriendRecommendations bookId={bookId} />
          <div>Rating<AddToCart bookId={book.id} price={book.price} /></div>
          <StarRating stars={book.rating} />
        </div>
      </div>
    </div>
  );
}

export default ProductRow;
