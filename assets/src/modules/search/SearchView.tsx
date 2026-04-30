import { CategoryNavBar } from '../category/categoryNavBar/CategoryNavBar';
import { SearchBar } from './searchBar/SearchBar';
import { SearchGallery } from './SearchGallery';

export default function SearchView() {
  return (
    <div className="Category">
      <SearchBar />
      <CategoryNavBar />
      <SearchGallery />
    </div>
  );
}
