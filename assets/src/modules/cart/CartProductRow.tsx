import { useState, useEffect } from 'react';
import { get, put, del } from 'aws-amplify/api';
import { Spinner } from 'react-bootstrap';
import '../../common/styles/productRow.css';
import StarRating from '../../common/starRating/StarRating';
import FriendRecommendations from '../../common/friendRecommendations/FriendRecommendations';
import { Book } from '../bestSellers/BestSellerProductRow';

export interface Order { bookId: string; quantity: number; price: number; }

interface CartProductRowProps { order: Order; calculateTotal: () => void; }

export function CartProductRow({ order, calculateTotal }: CartProductRowProps) {
  const [book, setBook] = useState<Book | undefined>();
  const [removeLoading, setRemoveLoading] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await get({ apiName: 'books', path: `/books/${order.bookId}` }).response;
        setBook(await res.body.json() as any);
      } catch (e) { alert(e); }
    })();
  }, [order.bookId]);

  const onRemove = async () => {
    setRemoveLoading(true);
    await del({ apiName: 'cart', path: `/cart/${order.bookId}` }).response;
    calculateTotal();
  };

  const onQuantityUpdated = async (e: React.ChangeEvent<HTMLInputElement>) => {
    await put({ apiName: 'cart', path: '/cart', options: { body: { bookId: order.bookId, quantity: parseInt(e.target.value, 10) } } }).response;
  };

  if (!book) return null;

  return (
    <div className="white-box">
      <div className="media">
        <div className="media-left media-middle">
          <img className="media-object product-thumb" src={book.cover} alt={`${book.name} cover`} />
        </div>
        <div className="media-body">
          <h3 className="media-heading">{book.name}<div className="float-end margin-1"><small>${book.price}</small></div></h3>
          <p><small>{book.category}</small></p>
          <FriendRecommendations bookId={order.bookId} />
          <div>
            Rating
            <div className="float-end">
              <div className="input-group">
                <input type="number" className="form-control" placeholder="Quantity" defaultValue={order.quantity.toString()} onChange={onQuantityUpdated} min={1} />
                <button className="btn btn-black" type="button" onClick={onRemove} disabled={removeLoading}>
                  {removeLoading && <Spinner size="sm" className="me-2" />}Remove
                </button>
              </div>
            </div>
          </div>
          <p><StarRating stars={book.rating} /></p>
        </div>
      </div>
    </div>
  );
}

export default CartProductRow;
