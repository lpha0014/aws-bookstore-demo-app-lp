import { useState, useEffect } from 'react';
import { get } from 'aws-amplify/api';
import '../../common/styles/productRow.css';
import StarRating from '../../common/starRating/StarRating';
import AddToCart from '../../common/AddToCart';
import FriendRecommendations from '../../common/friendRecommendations/FriendRecommendations';
import { Book } from '../bestSellers/BestSellerProductRow';
import { Order } from '../cart/CartProductRow';

export function PurchasedProductRow({ order }: { order: Order }) {
  const [book, setBook] = useState<Book | undefined>();

  useEffect(() => {
    (async () => {
      try {
        const res = await get({ apiName: 'books', path: `/books/${order.bookId}` }).response;
        setBook(await res.body.json() as any);
      } catch (e) { alert(e); }
    })();
  }, [order.bookId]);

  if (!book) return <div className="white-box"><div className="media"><div className="loader-no-margin" /></div></div>;

  return (
    <div className="white-box">
      <div className="media">
        <div className="media-left media-middle">
          <img className="media-object product-thumb" src={book.cover} alt={`${book.name} cover`} />
        </div>
        <div className="media-body">
          <h3 className="media-heading">{book.name}<div className="float-end margin-1"><small>{`${order.quantity} @ ${book.price}`}</small></div></h3>
          <small>{book.category}</small>
          <FriendRecommendations bookId={order.bookId} />
          <div>Rating<AddToCart bookId={book.id} price={book.price} variant="buyAgain" /></div>
          <StarRating stars={book.rating} />
        </div>
      </div>
    </div>
  );
}

export default PurchasedProductRow;
