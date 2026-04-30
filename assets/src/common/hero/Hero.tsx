import image from '../../images/hero/hero-main.png';
import './hero.css';

export function Hero() {
  return <img src={image} className="img-fluid full-width" alt="The more you read the more you know" />;
}

export default Hero;
