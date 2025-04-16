import { useEffect, useState } from 'react';

function MyPickups() {
  const [myPickups, setMyPickups] = useState([]);
  const user = JSON.parse(localStorage.getItem('user')); // ✅ move outside useEffect
  const shelterId = user?.orgId;

  useEffect(() => {
    if (!shelterId) return;

    fetch(`http://localhost:5001/api/food-postings/mypickups/${shelterId}`)
      .then(res => res.json())
      .then(data => setMyPickups(data))
      .catch(err => console.error('Failed to load pickups:', err));
  }, [shelterId]);

  return (
    <div className="mypickups-wrapper">
      <h2>My Pickups</h2>
      {myPickups.length === 0 ? (
        <p>No pickups yet.</p>
      ) : (
        myPickups.map((posting, i) => (
          <div key={i}>
            <h4>{posting.restaurantId?.name}</h4>
            <ul>
              {posting.items
                .filter(item => item.requested && item.requestedBy === shelterId)
                .map((item, j) => (
                  <li key={j}>{item.foodItem} – {item.pounds} lbs</li>
                ))}
            </ul>
          </div>
        ))
      )}
    </div>
  );
}

export default MyPickups;
