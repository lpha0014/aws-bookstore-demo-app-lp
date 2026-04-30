import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { get } from 'aws-amplify/api';
import { CategoryNavBar } from '../category/categoryNavBar/CategoryNavBar';
import { SearchBar } from '../search/searchBar/SearchBar';
import { CartProductRow, Order } from './CartProductRow';
import '../../common/hero/hero.css';
import '../../common/styles/common.css';

export default function ShoppingCart() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const fetchCart = async () => {
    try {
      const res = await get({ apiName: 'cart', path: '/cart' }).response;
      const data = await res.body.json() as any;
      setOrders(data || []);
    } catch (e) {
      alert(e);
    }
  };

  useEffect(() => {
    fetchCart().then(() => setIsLoading(false));
  }, []);

  const orderTotal = orders.reduce((t, o) => t + o.price * o.quantity, 0).toFixed(2);

  if (isLoading) return <div className="loader"></div>;

  return (
    <div className="Category">
      <SearchBar />
      <CategoryNavBar />
      <div className="well-bs padding-bottom-120">
        <div className="white-box no-margin-top"><h3>Shopping cart</h3></div>
        {orders.map(order => <CartProductRow order={order} key={order.bookId} calculateTotal={fetchCart} />)}
        <div className="float-end checkout-padding">
          <button className="btn btn-black" type="button" disabled={orders.length < 1} onClick={() => navigate('/checkout')}>Checkout (${orderTotal})</button>
        </div>
      </div>
      <div className="well-bs col-md-12 full-page"></div>
    </div>
  );
}
