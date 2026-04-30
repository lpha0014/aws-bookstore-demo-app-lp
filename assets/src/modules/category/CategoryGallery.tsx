import { useState, useEffect } from 'react';
import { get } from 'aws-amplify/api';
import '../../common/styles/gallery.css';
import CategoryGalleryBook from './CategoryGalleryBook';
import { Book } from '../bestSellers/BestSellerProductRow';

interface CategoryGalleryProps { categoryId: string; }

export function CategoryGallery({ categoryId }: CategoryGalleryProps) {
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await get({ apiName: 'books', path: `/books?category=${categoryId}` }).response;
        setBooks(await res.body.json() as any || []);
      } catch (e) { alert(e); }
      setIsLoading(false);
    })();
  }, [categoryId]);

  if (isLoading) return <div className="loader" />;
  return (
    <div className="well-bs no-radius">
      <div className="container-category">
        <h3>{categoryId}</h3>
        <div className="row">{books.map(book => <CategoryGalleryBook book={book} key={book.id} />)}</div>
      </div>
    </div>
  );
}

export default CategoryGallery;
