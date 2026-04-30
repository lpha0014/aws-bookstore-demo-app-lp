import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { get, post, put } from 'aws-amplify/api';
import { Spinner } from 'react-bootstrap';

interface AddToCartProps {
  bookId: string;
  price: number;
  variant?: string;
}

export default function AddToCart({ bookId, price, variant }: AddToCartProps) {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onAddToCart = async () => {
    setLoading(true);
    try {
      const res = await get({ apiName: 'cart', path: `/cart/${bookId}` }).response;
      const bookInCart = await res.body.json();

      if (bookInCart) {
        await put({ apiName: 'cart', path: '/cart', options: { body: { bookId, quantity: (bookInCart as any).quantity + 1 } } }).response;
      } else {
        await post({ apiName: 'cart', path: '/cart', options: { body: { bookId, price, quantity: 1 } } }).response;
      }
    } catch {
      await post({ apiName: 'cart', path: '/cart', options: { body: { bookId, price, quantity: 1 } } }).response;
    }
    navigate('/cart');
  };

  const className = `btn btn-black${variant === 'center' ? ' btn-black-center' : ' float-end'}`;

  return (
    <button className={className} disabled={loading} type="button" onClick={onAddToCart}>
      {loading && <Spinner size="sm" className="me-2" />}
      {variant === 'buyAgain' ? 'Buy again' : 'Add to cart'}
    </button>
  );
}
