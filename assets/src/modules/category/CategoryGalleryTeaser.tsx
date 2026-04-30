import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { get } from 'aws-amplify/api';
import '../../common/styles/gallery.css';
import CategoryGalleryBook from './CategoryGalleryBook';
import { Book } from '../bestSellers/BestSellerProductRow';

export function CategoryGalleryTeaser() {
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await get({ apiName: 'books', path: '/books?category=Cookbooks' }).response;
        setBooks(await res.body.json() as any || []);
      } catch (e) { alert(e); }
      setIsLoading(false);
    })();
  }, []);

  if (isLoading) return <div className="loader" />;
  return (
    <div className="well-bs no-padding-top col-md-12 no-radius">
      <div className="container-category">
        <h3>Cookbooks <small><Link to="/category/Cookbooks">Browse cookbooks</Link></small></h3>
        <div className="row">{books.slice(0, 4).map(book => <CategoryGalleryBook book={book} key={book.id} />)}</div>
      </div>
    </div>
  );
}

export default CategoryGalleryTeaser;
