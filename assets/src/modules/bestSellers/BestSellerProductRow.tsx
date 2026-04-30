import { useState, useEffect } from 'react';
import { get } from 'aws-amplify/api';
import AddToCart from '../../common/AddToCart';
import FriendRecommendations from '../../common/friendRecommendations/FriendRecommendations';
import StarRating from '../../common/starRating/StarRating';
import '../../common/styles/productRow.css';

export interface Book { id: string; cover: string; price: number; category: string; name: string; rating: number; author: string; }

export default function BestSellerProductRow({ bookId }: { bookId: string }) {
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
          <img className="media-object product-thumb" src={book.cover} alt={`${book.name} cover`} />
        </div>
        <div className="media-body product-padding padding-20">
          <h3 className="media-heading">{book.name}<small className="float-end margin-1"><h4>${book.price}</h4></small></h3>
          <p><small>{book.category}</small></p>
          <FriendRecommendations bookId={bookId} />
          <div>Rating<AddToCart bookId={bookId} price={book.price} /></div>
          <StarRating stars={book.rating} />
        </div>
      </div>
    </div>
  );
}

export { BestSellerProductRow as ProductRow };
