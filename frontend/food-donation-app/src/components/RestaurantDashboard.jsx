import PostFoodForm from './PostFoodForm';
import RequestList from './RequestList';

function RestaurantDashboard() {
  return (
    <div>
      <PostFoodForm />

      <RequestList />

      {/* Bonus later: show “My Posted Foods” */}
    </div>
  );
}

export default RestaurantDashboard;
