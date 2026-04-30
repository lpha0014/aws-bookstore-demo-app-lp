import { useParams } from 'react-router-dom';
import { CategoryNavBar } from './categoryNavBar/CategoryNavBar';
import { SearchBar } from '../search/searchBar/SearchBar';
import { BestSellersBar } from '../bestSellers/bestSellersBar/BestSellersBar';
import { CategoryGallery } from './CategoryGallery';

import database from '../../images/hero/hero-database.png';
import cars from '../../images/hero/hero-cars.png';
import cooks from '../../images/hero/hero-cookbooks.png';
import fairy from '../../images/hero/hero-fairytales.png';
import home from '../../images/hero/hero-home.png';
import scifi from '../../images/hero/hero-science.png';
import woodwork from '../../images/hero/hero-woodwork.png';
import '../../common/hero/hero.css';
import { categories } from './categoryNavBar/categories';

const imageMap: Record<string, string> = {
  [categories.cooks]: cooks,
  [categories.database]: database,
  [categories.fairy]: fairy,
  [categories.scifi]: scifi,
  [categories.home]: home,
  [categories.cars]: cars,
  [categories.woodwork]: woodwork,
};

export default function CategoryView() {
  const { id } = useParams<{ id: string }>();
  const image = imageMap[id || ''] || cooks;

  return (
    <div className="Category">
      <SearchBar />
      <CategoryNavBar />
      <BestSellersBar />
      <img src={image} alt={`${id} hero`} className="img-fluid full-width top-hero-padding" />
      <CategoryGallery categoryId={id || ''} />
    </div>
  );
}
