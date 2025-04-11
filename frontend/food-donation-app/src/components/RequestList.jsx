import { useEffect, useState } from 'react';
import './RequestList.css';

function RequestList() {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const mockData = [
      { id: 1, item: 'Rice', pounds: 20, requestedByEmail: 'shelter@example.com' },
      { id: 2, item: 'Tomatoes', pounds: 10, requestedByEmail: 'shelter2@example.com' },
    ];
    setRequests(mockData);
  }, []);

  const handleFulfill = (request) => {
    console.log('Fulfilling request:', request);
    // Later: POST to backend
  };

  return (
    <div className="request-list-wrapper">
      <h3 className="request-list-title">Open Food Requests</h3>
      {requests.length === 0 ? (
        <p className="request-list-empty">No current requests.</p>
      ) : (
        <ul className="request-list-items">
          {requests.map((req) => (
            <li key={req.id} className="request-list-item">
              <div>
                <p className="request-list-item-name">{req.item} ({req.pounds} lbs)</p>
                <p className="request-list-email">Requested by: {req.requestedByEmail}</p>
              </div>
              <button
                onClick={() => handleFulfill(req)}
                className="request-list-btn"
              >
                Fulfill
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default RequestList;
