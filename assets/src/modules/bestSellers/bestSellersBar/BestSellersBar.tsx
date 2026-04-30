import { Link } from 'react-router-dom';
import '../../../common/styles/gallery.css';
import burgers from '../../../images/bestSellers/burgers.png';
import italian from '../../../images/bestSellers/italian.png';
import noodles from '../../../images/bestSellers/noodles.png';
import pancakes from '../../../images/bestSellers/pancakes.png';
import pineapple from '../../../images/bestSellers/pineapple.png';
import umami from '../../../images/bestSellers/umami.png';

const bestSellers = [burgers, italian, noodles, pancakes, pineapple, umami];

export function BestSellersBar() {
  return (
    <div className="center ad-gallery nav">
      <div className="col-md-2 d-none d-md-block">
        <Link to="/best"><h3>Bookstore<br/>Best Sellers</h3></Link>
      </div>
      <div className="row">
        {bestSellers.map(book => (
          <div className="col-md-2 d-none d-md-block" key={book}>
            <Link to="/best"><img src={book} className="thumbs" alt="" /></Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BestSellersBar;
