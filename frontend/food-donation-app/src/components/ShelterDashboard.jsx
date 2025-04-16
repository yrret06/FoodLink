import AvailableFoodList from './AvailableFoodList';
import FoodRequestForm from './FoodRequestForm';

function ShelterDashboard() {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Available Food Near You</h2>
      
      <AvailableFoodList />
      <FoodRequestForm />

      

      {/* Bonus later: allow “Request Specific Food” if none found */}
    </div>
  );
}

export default ShelterDashboard;
