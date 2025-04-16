import { useEffect, useState } from 'react';
import './AvailableFoodList.css';

function AvailableFoodList() {
  const [foodList, setFoodList] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5001/api/food-postings')
      .then(res => {
        if (!res.ok) {
          throw new Error('Failed to fetch food postings');
        }
        return res.json();
      })
      .then(data => setFoodList(data))
      .catch(err => console.error('Failed to fetch food postings:', err));
  }, []);

 const requestItem = async (item, postingId) => {
  const user = JSON.parse(localStorage.getItem('user'));
  const shelterId = user?.orgId;

  if (!shelterId) {
    alert('You must be logged in as a shelter to request items');
    return;
  }

  try {
    const res = await fetch(`http://localhost:5001/api/food-postings/${postingId}/request`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ foodItemName: item.foodItem, shelterId }),
    });

    if (!res.ok) throw new Error('Failed to request item');

    const updated = await res.json();
    // Update UI by removing the item locally
    setFoodList(prev =>
      prev.map(p =>
        p._id === updated._id ? updated : p
      )
    );
  } catch (err) {
    console.error('Error requesting item:', err);
    alert('Error requesting item');
  }
};

  return (
    <div className="foodlist-wrapper">
      <h2 className="foodlist-title">Available Food</h2>

      {foodList.length === 0 ? (
        <p className="foodlist-empty">No food available right now.</p>
      ) : (
        foodList.map((posting, i) => (
          <div key={i} className="foodlist-restaurant-group">
            <div className="foodlist-header">
              <h3 className="restaurant-name">{posting.restaurantId?.name || 'Unknown Restaurant'}</h3>
              <span className={`priority-tag priority-${(posting.priority || 'Medium').toLowerCase()}`}>
  {(posting.priority || 'Medium')} Priority
</span>

{Array.isArray(posting.items) && (
  <ul className="foodlist-items">
    {posting.items
      .filter(item => !item.requested)
      .map((item, j) => (
        <li key={j} className="foodlist-item">
          <span className="foodlist-text">
            {item.foodItem} – {item.pounds} lbs
          </span>
          <button
            onClick={() => requestItem(item, posting._id)}
            className="foodlist-request-btn"
          >
            Request
          </button>
        </li>
    ))}
  </ul>
)}

            </div>
            <ul className="foodlist-items">
              {posting.items.map((item, j) => (
                <li key={j} className="foodlist-item">
                  <span className="foodlist-text">
                    {item.foodItem} – {item.pounds} lbs
                  </span>
                  <button
                    onClick={() => requestItem(item, posting.restaurantId?._id)}
                    className="foodlist-request-btn"
                  >
                    Request
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))
      )}
    </div>
  );
}

export default AvailableFoodList;
