import { Routes, Route } from 'react-router-dom';
import Checkout from './modules/checkout/Checkout';
import CheckoutConfirm from './modules/checkout/CheckoutConfirm';
import Home from './modules/signup/Home';
import NotFound from './modules/notFound/NotFound';
import CategoryView from './modules/category/CategoryView';
import ShoppingCart from './modules/cart/ShoppingCart';
import PastPurchases from './modules/pastPurchases/PastPurchases';
import BestSellers from './modules/bestSellers/BestSellers';
import SearchView from './modules/search/SearchView';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/best" element={<BestSellers />} />
      <Route path="/cart" element={<ShoppingCart />} />
      <Route path="/category/:id" element={<CategoryView />} />
      <Route path="/past" element={<PastPurchases />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/checkout-confirm" element={<CheckoutConfirm />} />
      <Route path="/search/:id" element={<SearchView />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
