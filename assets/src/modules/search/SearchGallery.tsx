import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { get } from 'aws-amplify/api';
import '../../common/styles/gallery.css';
import CategoryGalleryBook from '../category/CategoryGalleryBook';
import { Book } from '../bestSellers/BestSellerProductRow';

export function SearchGallery() {
  const { id } = useParams<{ id: string }>();
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await get({ apiName: 'search', path: `/search?q=${id}` }).response;
        const searchResults = await res.body.json() as any;
        const mapped = (searchResults.hits?.hits || []).map((hit: any) => ({
          author: hit._source.author.S,
          category: hit._source.category.S,
          cover: hit._source.cover.S,
          id: hit._source.id.S,
          name: hit._source.name.S,
          price: hit._source.price.N,
          rating: hit._source.rating.N,
        }));
        setBooks(mapped);
      } catch (e) { alert(e); }
      setIsLoading(false);
    })();
  }, [id]);

  if (isLoading) return <div className="loader" />;
  return (
    <div className="well-bs no-radius">
      <div className="container-category">
        <h3>Search results</h3>
        <div className="row">{books.map(book => <CategoryGalleryBook book={book} key={book.id} />)}</div>
      </div>
    </div>
  );
}

export default SearchGallery;
