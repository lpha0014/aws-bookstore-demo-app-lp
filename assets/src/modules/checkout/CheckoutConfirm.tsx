import { useNavigate } from 'react-router-dom';
import { CategoryNavBar } from '../category/categoryNavBar/CategoryNavBar';
import { SearchBar } from '../search/searchBar/SearchBar';
import bestSellers from '../../images/bestSellers.png';
import pastOrders from '../../images/pastOrders.png';
import './checkout.css';

export default function CheckoutConfirm() {
  const navigate = useNavigate();

  return (
    <div>
      <SearchBar />
      <CategoryNavBar />
      <div className="well-bs">
        <div className="white-box no-margin-top no-margin-bottom"><h3>Purchase confirmed</h3></div>
      </div>
      <div className="well-bs full-page no-padding-bottom no-padding-top">
        <div className="white-box padding-50 no-margin-top col-md-12 no-margin-bottom">
          <h4 className="text-center">Your purchase is complete!</h4>
          <button className="btn btn-black btn-black-center" type="button" onClick={() => navigate('/past')}>View Receipt</button>
        </div>
        <div className="no-margin-top no-padding">
          <a href="/best"><img src={bestSellers} alt="Best sellers" className="checkout-img no-padding" /></a>
          <a href="/past"><img src={pastOrders} alt="Past orders" className="checkout-img no-padding" /></a>
        </div>
      </div>
    </div>
  );
}
