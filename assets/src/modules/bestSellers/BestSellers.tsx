import { useState, useEffect } from 'react';
import { get } from 'aws-amplify/api';
import BestSellerProductRow from './BestSellerProductRow';
import { CategoryNavBar } from '../category/categoryNavBar/CategoryNavBar';
import { SearchBar } from '../search/searchBar/SearchBar';

export default function BestSellers() {
  const [books, setBooks] = useState<{ bookId: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await get({ apiName: 'bestsellers', path: '/bestsellers' }).response;
        const bestSellers = await res.body.json() as any;
        setBooks(bestSellers.map((b: string) => ({ bookId: JSON.parse(b) })));
      } catch (e) { alert(e); }
      setIsLoading(false);
    })();
  }, []);

  return (
    <div className="Category">
      <SearchBar />
      <CategoryNavBar />
      <div className="well-bs no-radius">
        <div className="container-category"><h3>Top 20 best sellers</h3></div>
        {isLoading ? <div className="loader" /> : books.slice(0, 20).map(b => <BestSellerProductRow bookId={b.bookId} key={b.bookId} />)}
      </div>
    </div>
  );
}
