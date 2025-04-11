import './AvailableFoodList.css';

function AvailableFoodList() {
  const mockFood = [
    { id: 1, name: 'Bread', quantity: '5 loaves' },
    { id: 2, name: 'Carrots', quantity: '10 lbs' },
    { id: 3, name: 'Rice', quantity: '15 lbs' },
  ];

  const requestItem = (item) => {
    console.log('Requesting food:', item);
    // Will connect to backend later
  };

  return (
    <div className="foodlist-wrapper">
      <h2 className="foodlist-title">Available Food</h2>
      <ul className="foodlist-items">
        {mockFood.map((item) => (
          <li key={item.id} className="foodlist-item">
            <span className="foodlist-text">
              {item.name} – {item.quantity}
            </span>
            <button
              onClick={() => requestItem(item)}
              className="foodlist-request-btn"
            >
              Request
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AvailableFoodList;
