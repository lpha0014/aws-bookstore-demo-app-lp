import { Link } from 'react-router-dom';
import yourpastorders from '../../images/yourpastorders.png';
import bestSellers from '../../images/bestSellers.png';
import yourshoppingcart from '../../images/yourshoppingcart.png';
import { Hero } from '../../common/hero/Hero';
import { CategoryNavBar } from '../category/categoryNavBar/CategoryNavBar';
import { SearchBar } from '../search/searchBar/SearchBar';
import { BestSellersBar } from '../bestSellers/bestSellersBar/BestSellersBar';
import { CategoryGalleryTeaser } from '../category/CategoryGalleryTeaser';
import { FriendsBought } from '../friends/FriendsBought';
import './home.css';

export default function Home() {
  return (
    <div className="Home">
      <div className="bookstore">
        <Hero />
        <SearchBar />
        <CategoryNavBar />
        <BestSellersBar />
        <div className="well-bs col-md-12 ad-container-padding">
          <div className="col-md-4 ad-padding">
            <div className="container-category no-padding">
              <Link to="/past"><img src={yourpastorders} alt="Past orders" /></Link>
            </div>
          </div>
          <div className="col-md-4 ad-padding">
            <div className="container-category no-padding">
              <Link to="/cart"><img src={yourshoppingcart} alt="Shopping cart" /></Link>
            </div>
          </div>
          <div className="col-md-4 ad-padding">
            <div className="container-category no-padding">
              <Link to="/best"><img src={bestSellers} alt="Best sellers" /></Link>
            </div>
          </div>
        </div>
        <CategoryGalleryTeaser />
        <FriendsBought />
      </div>
    </div>
  );
}
