import { useState, useEffect } from 'react';
import { get } from 'aws-amplify/api';
import { ProductRow } from './ProductRow';

export function FriendsBought() {
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await get({ apiName: 'recommendations', path: '/recommendations' }).response;
        setRecommendations(await res.body.json() as any || []);
      } catch (e) { alert(e); }
      setIsLoading(false);
    })();
  }, []);

  if (isLoading) return null;
  return (
    <div className="well-bs no-padding-top col-md-12 no-border">
      <div className="container-category"><h3>Books your friends have bought</h3></div>
      {recommendations.slice(0, 5).map(r => <ProductRow bookId={r.bookId} key={r.bookId} />)}
    </div>
  );
}

export default FriendsBought;
