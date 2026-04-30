import { useState, useEffect } from 'react';
import { get } from 'aws-amplify/api';
import { FriendThumb } from './FriendThumb';

export default function FriendRecommendations({ bookId }: { bookId: string }) {
  const [friends, setFriends] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await get({ apiName: 'recommendations', path: `/recommendations/${bookId}` }).response;
        setFriends(await res.body.json() as any || []);
      } catch { /* ignore */ }
    })();
  }, [bookId]);

  if (!(friends[0]?.friendsPurchased?.length > 0)) return <div className="no-friends-padding" />;

  const purchased = friends[0].friendsPurchased;
  return (
    <div>
      <div>Friends who bought this book</div>
      <p>
        {purchased.slice(0, 3).map((f: any) => <FriendThumb key={f} />)}
        {purchased.length > 3 && <span className="orange">{` +${purchased.length - 3} ${purchased.length - 3 > 1 ? 'others' : 'other'}`}</span>}
      </p>
    </div>
  );
}
