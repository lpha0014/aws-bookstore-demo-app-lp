import { Link } from 'react-router-dom';
import { categories } from './categories';
import './categories.css';

export function CategoryNavBar() {
  return (
    <ul className="nav nav-pills justify-content-center nav-cat">
      {Object.values(categories).map(category => (
        <li className="nav-item" key={category}>
          <Link className="nav-link category-link" to={`/category/${category}`}>{category}</Link>
        </li>
      ))}
    </ul>
  );
}

export default CategoryNavBar;
