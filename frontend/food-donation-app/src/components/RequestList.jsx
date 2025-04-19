import { useEffect, useState } from 'react';
import './RequestList.css';

function RequestList() {
  const [requests, setRequests] = useState([]);
  const [fulfillInput, setFulfillInput] = useState({}); // { requestId: pounds }

  useEffect(() => {
    fetch('http://localhost:5001/api/food-requests')
      .then((res) => res.json())
      .then((data) => setRequests(data))
      .catch((err) => console.error('Failed to fetch food requests:', err));
  }, []);

  const handleFulfill = async (request) => {
    const poundsToFulfill = fulfillInput[request._id];
    if (!poundsToFulfill || poundsToFulfill <= 0) {
      alert('Enter a valid pound amount');
      return;
    }

    try {
      const res = await fetch(`http://localhost:5001/api/food-requests/${request._id}/fulfill`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ poundsFulfilled: parseFloat(poundsToFulfill) }),
      });

      if (!res.ok) throw new Error('Failed to fulfill request');

      const updated = await res.json();

      setRequests((prev) =>
        prev.map((r) => (r._id === updated._id ? updated : r))
      );
      setFulfillInput((prev) => ({ ...prev, [request._id]: '' }));
    } catch (err) {
      console.error(err);
      alert('Error fulfilling request');
    }
  };

  return (
    <div className="request-list-wrapper">
      <h3 className="request-list-title">Open Food Requests</h3>
      {requests.length === 0 ? (
        <p className="request-list-empty">No current requests.</p>
      ) : (
        <ul className="request-list-items">
          {requests.map((req, index) => (
            <li key={index} className="request-list-item">
              <div>
                <p className="request-list-item-name">
                  {req.food.item} ({req.food.pounds} lbs)
                </p>
                <p className="request-list-email">
                  Requested by: {req.shelterId?.name || 'Unknown Shelter'}
                </p>
                <p className="request-status">
                  Fulfilled: {req.poundsFulfilled || 0} lbs
                  {req.fulfilled && ' ✅ (Complete)'}
                </p>
              </div>

              {!req.fulfilled && (
                <div className="fulfill-form">
                  <input
                    type="number"
                    min="1"
                    max={req.food.pounds - (req.poundsFulfilled || 0)}
                    value={fulfillInput[req._id] || ''}
                    onChange={(e) =>
                      setFulfillInput((prev) => ({
                        ...prev,
                        [req._id]: e.target.value,
                      }))
                    }
                    placeholder="lbs to fulfill"
                    className="request-input"
                  />
                  <button
                    onClick={() => handleFulfill(req)}
                    className="request-list-btn"
                  >
                    Fulfill
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default RequestList;
