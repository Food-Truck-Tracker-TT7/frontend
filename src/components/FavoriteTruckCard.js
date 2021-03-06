import React from 'react';
import { connect } from 'react-redux';
import { deleteFavoriteTruck, findTruck } from '../store/actions';
import { Link, useHistory } from 'react-router-dom';

import StyledFavoriteTruckCard from '../styles/StyledFavoriteTruckCard';

function FavoriteTruckCard(props) {
  const {
    id,
    name,
    currentLocation,
    cuisineType,
    customerRatingsAvg,
    imageOfTruck,
    departureTime,
  } = props.truck;
  const { user, deleteFavoriteTruck, findTruck } = props;
  const { push } = useHistory();
  const departure = new Date(departureTime);

  const removeFavorites = () => {
    console.log('Id that is being passed in: ', id);
    deleteFavoriteTruck(user.dinerId, id);
  };
  const locateTruck = () => {
    findTruck(currentLocation, push);
  };
  return (
    <StyledFavoriteTruckCard>
      <Link to={`/truck/${id}`}>
        <h2>{name}</h2>
        <p>
          <img src={imageOfTruck} alt='food truck' />
        </p>
      </Link>
      <p>{cuisineType}</p>
      <p>Average Rating: {customerRatingsAvg}</p>
      <p>
        Departure Time: {departure.toLocaleDateString()}{' '}
        {departure.toLocaleTimeString()}
      </p>
      <button onClick={locateTruck}>Find Truck</button>
      {/* <button onClick={removeFavorites}>Remove From Favorites</button> */}
    </StyledFavoriteTruckCard>
  );
}

const mapStateToProps = state => {
  return {
    user: state.user,
  };
};

export default connect(mapStateToProps, { deleteFavoriteTruck, findTruck })(
  FavoriteTruckCard
);
