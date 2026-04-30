import { useState, useEffect } from 'react';
import { get } from 'aws-amplify/api';
import { CategoryNavBar } from '../category/categoryNavBar/CategoryNavBar';
import { SearchBar } from '../search/searchBar/SearchBar';
import { PurchasedProductRow } from './PurchasedProductRow';
import { Order } from '../cart/CartProductRow';
import bestSellers from '../../images/bestSellers.png';
import yourshoppingcart from '../../images/yourshoppingcart.png';
import '../../common/hero/hero.css';

interface Purchases { orderDate: number; orderId: string; books: Order[]; }

export default function PastPurchases() {
  const [orders, setOrders] = useState<Purchases[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await get({ apiName: 'orders', path: '/orders' }).response;
        setOrders(await res.body.json() as any || []);
      } catch (e) { alert(e); }
      setIsLoading(false);
    })();
  }, []);

  const getPrettyDate = (d: number) => {
    const date = new Date(d);
    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()} ${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`;
  };

  return (
    <div className="Category">
      <SearchBar />
      <CategoryNavBar />
      <div className="well-bs col-md-12">
        <div className="white-box no-margin-top"><h3>Past purchases</h3></div>
        {!isLoading && orders.sort((a, b) => b.orderDate - a.orderDate).map(order => (
          <div className="order-date" key={order.orderId}>
            <h4>{`Order date: ${getPrettyDate(order.orderDate)}`}</h4>
            {order.books.map(book => <PurchasedProductRow order={book} key={book.bookId} />)}
          </div>
        ))}
        <div className="well-bs no-margin-top no-padding col-md-12">
          <a href="/best"><img src={bestSellers} alt="Best sellers" className="checkout-img no-padding" /></a>
          <a href="/cart"><img src={yourshoppingcart} alt="Shopping cart" className="checkout-img no-padding" /></a>
        </div>
      </div>
    </div>
  );
}
