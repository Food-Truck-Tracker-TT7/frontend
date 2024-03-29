import axios from 'axios';
import axiosWithAuth from '../../utils/axiosWithAuth';

//Constants
const BASE_URL = 'https://food-truck-trackr-api.herokuapp.com/api';

// Action Types
export const LOADING = 'LOADING';
export const ERROR = 'ERROR';
export const UPDATE = 'UPDATE';
export const SET_USER = 'SET_USER';
export const SET_USER_TYPE = 'SET_USER_TYPE';
export const SET_FAVORITE_TRUCKS = 'SET_FAVORITE_TRUCKS';
export const LOGOUT_USER = 'LOGOUT_USER';
export const SET_TRUCKS = 'SET_TRUCKS';
export const SET_TRUCK = 'SET_TRUCK';
export const ADD_TRUCK = 'ADD_TRUCK';
export const EDIT_TRUCK = 'EDIT_TRUCK';
export const TRUCK_UPDATED = 'TRUCK_UPDATED';
export const SET_FIND_TRUCK = 'SET_FIND_TRUCK';
export const FETCH_TRUCKS_OWNED = 'FETCH_TRUCKS_OWNED';
export const SET_FILTERED_TRUCKS_CUISINE = 'SET_FILTERED_TRUCKS_CUISINE';
export const SET_FILTERED_TRUCKS_RATING = 'SET_FILTERED_TRUCKS_RATING';
export const CLEAR_FILTERED_TRUCKS = 'CLEAR_FILTERED_TRUCKS';
export const SET_MENU = 'SET_MENU';
export const ADD_MENU_ITEM = 'ADD_MENU_ITEM';
export const SET_MENU_ITEM_TO_EDIT = 'SET_MENU_ITEM_TO_EDIT';
export const SET_DARK_MODE = 'SET_DARK_MODE';

// Action creators

// ------------------------------------------------------
// --------------- Auth ---------------------------------
//-------------------------------------------------------

//Adds a new diner to the backend
export const addDiner = (diner, redirectTo) => {
  return dispatch => {
    axios
      .post(`${BASE_URL}/auth/register/diner`, diner)
      .then(res => {
        redirectTo('/login');
      })
      .catch(err => {
        dispatch({ type: ERROR, payload: err.message });
      });
  };
};

//Adds an operator to the backend
export const addOperator = (operator, redirectTo) => {
  return dispatch => {
    axios
      .post(`${BASE_URL}/auth/register/operator`, operator)
      .then(res => {
        redirectTo('/login');
      })
      .catch(err => {
        dispatch({ type: ERROR, payload: err.message });
      });
  };
};

//Logs the user in, sets the JWT to local store and updates the user in state
export const loginUser = (loginInfo, redirectTo) => {
  return dispatch => {
    dispatch({ type: LOADING });
    axios
      .post(`${BASE_URL}/auth/login`, loginInfo)
      .then(res => {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('userType', res.data.type);
        dispatch({ type: SET_USER_TYPE, payload: res.data.type });
        if (res.data.type === 'diner') {
          localStorage.setItem('user', JSON.stringify(res.data.diner));
          dispatch({ type: SET_USER, payload: res.data.diner });
        } else {
          localStorage.setItem('user', JSON.stringify(res.data.operator));
          dispatch({ type: SET_USER, payload: res.data.operator });
        }
        redirectTo('/map');
      })
      .catch(err => {
        dispatch({ type: ERROR, payload: err.message });
      });
  };
};

// logs the user out
export const logoutUser = () => {
  return dispatch => {
    localStorage.removeItem('user');
    localStorage.removeItem('userType');
    localStorage.removeItem('token');
    dispatch({ type: LOGOUT_USER });
  };
};

export const setDarkMode = () => {
  return dispatch => {
    dispatch({ type: SET_DARK_MODE });
  };
};

// --------------------------------------------------------------------
//-------------------- Trucks ----------------------------------------
// --------------------------------------------------------------------

//Fetches array of trucks
export const fetchTrucks = () => {
  return dispatch => {
    dispatch({ type: LOADING });
    axiosWithAuth()
      .get('/trucks')
      .then(res => {
        dispatch({ type: SET_TRUCKS, payload: res.data });
      })
      .catch(err => {
        dispatch({ type: ERROR, payload: err.message });
      });
  };
};

//Fetches a single truck's information based on truck ID
export const fetchTruck = truckId => {
  return dispatch => {
    dispatch({ type: LOADING });
    axiosWithAuth()
      .get(`/trucks/${truckId}`)
      .then(res => {
        dispatch({ type: SET_TRUCK, payload: res.data });
      })
      .catch(err => {
        dispatch({ type: ERROR, payload: err.message });
      });
  };
};

//Adds a new truck
export const addTruck = (truckInfo, redirectTo) => {
  return dispatch => {
    dispatch({ type: LOADING });
    axiosWithAuth()
      .post('/trucks', truckInfo)
      .then(res => {
        dispatch({ type: ADD_TRUCK, payload: res.data });
        redirectTo('/dashboard');
      })
      .catch(err => {
        dispatch({ type: ERROR, payload: err.message });
      });
  };
};

//Updates a truck with a given turck ID
export const updateTruck = (truckId, truckInfo, redirectTo) => {
  return dispatch => {
    axiosWithAuth()
      .put(`/trucks/${truckId}`, truckInfo)
      .then(res => {
        dispatch({ type: TRUCK_UPDATED });
        redirectTo(`/truck/${truckId}`);
      })
      .catch(err => {
        dispatch({ type: ERROR, payload: err.message });
      });
  };
};

//Delete a truck with a given truck ID
export const deleteTruck = truckId => {
  return dispatch => {
    axiosWithAuth()
      .delete(`/trucks/${truckId}`)
      .then(res => {
        dispatch({ type: UPDATE });
      })
      .catch(err => {
        dispatch({ type: ERROR, payload: err.message });
      });
  };
};

// Set the truck in state that we want to edit.
export const editTruck = (truck, redirectTo) => {
  return dispatch => {
    dispatch({ type: EDIT_TRUCK, payload: truck });
    redirectTo('/edittruck');
  };
};

export const setFilteredTrucksCuisine = cuiseType => {
  return dispatch => {
    dispatch({ type: SET_FILTERED_TRUCKS_CUISINE, payload: cuiseType });
  };
};

export const setFilteredTrucksRating = rating => {
  return dispatch => {
    dispatch({ type: SET_FILTERED_TRUCKS_RATING, payload: rating });
  };
};

export const clearFilteredTrucks = () => {
  console.log('click actions');
  return dispatch => {
    dispatch({ type: CLEAR_FILTERED_TRUCKS });
  };
};

// -------------------------------------------------------------
// -----------------------Menu Items ---------------------------
// -------------------------------------------------------------

//Fetches the menu for a given truck ID
export const fetchMenu = truckId => {
  return dispatch => {
    dispatch({ type: LOADING });

    axiosWithAuth()
      .get(`/trucks/${truckId}/menu`)
      .then(res => {
        dispatch({ type: SET_MENU, payload: res.data });
      })
      .catch(err => {
        dispatch({ type: ERROR, payload: err.message });
      });
  };
};

//Adds a item to the truck's menu
export const addMenuItem = (truckId, menuItem, redirectTo) => {
  return dispatch => {
    axiosWithAuth()
      .post(`/trucks/${truckId}/menu`, menuItem)
      .then(res => {
        redirectTo(`/truck/${truckId}`);
      })
      .catch(err => {
        dispatch({ type: ERROR, payload: err.message });
      });
  };
};

//Updates an item with the given menu item id for the given truck id
export const updateMenuItem = (truckId, menuItemId, menuItem, redirectTo) => {
  return dispatch => {
    axiosWithAuth()
      .put(`/trucks/${truckId}/menu/${menuItemId}`, menuItem)
      .then(res => {
        redirectTo(`/truck/${truckId}`);
      })
      .catch(err => {
        dispatch({ type: ERROR, payload: err.message });
      });
  };
};

//Deletes an item with the given menu item id for the given truck id
export const deleteMenuItem = (truckId, menuItemId) => {
  return dispatch => {
    axiosWithAuth()
      .delete(`/trucks/${truckId}/menu/${menuItemId}`)
      .then(res => {
        dispatch({ type: UPDATE });
      })
      .catch(err => {
        dispatch({ type: ERROR, payload: err.message });
      });
  };
};

// Adds a photo for a given menu item id for a given truck id
export const addItemPhoto = (truckId, menuItemId, photoURL) => {
  return dispatch => {
    axiosWithAuth()
      .post(`/trucks/${truckId}/menu/${menuItemId}/itemPhotos`, {
        url: photoURL,
      })
      .then(res => {
        dispatch({ type: UPDATE });
      })
      .catch(err => {
        dispatch({ type: ERROR, payload: err.message });
      });
  };
};

// Deletes a photo for a given menu item id for a given truck id
export const deleteItemPhoto = (truckId, menuItemId, photoURL) => {
  console.log('from action creator', photoURL);
  return dispatch => {
    axiosWithAuth()
      .delete(`/trucks/${truckId}/menu/${menuItemId}/itemPhotos`, {
        url: photoURL,
      })
      .then(res => {
        console.log(res);
        dispatch({ type: UPDATE });
      })
      .catch(err => {
        dispatch({ type: ERROR, payload: err.message });
      });
  };
};

// Set the menu item in state that we want to edit.
export const editMenuItem = menuItem => {
  return dispatch => {
    dispatch({ type: SET_MENU_ITEM_TO_EDIT, payload: menuItem });
  };
};

// ----------------------------------------------------------------------
// -------------------------- Diners ------------------------------------
// ----------------------------------------------------------------------

// Fetches the diner information for a diner with the given diner id
export const fetchDiner = dinerId => {
  return dispatch => {
    dispatch({ type: LOADING });
    axiosWithAuth()
      .get(`/diners/${dinerId}`)
      .then(res => {
        dispatch({ type: SET_USER, payload: res.data });
      })
      .catch(err => {
        dispatch({ type: ERROR, payload: err.message });
      });
  };
};

// Updates a diner information for a diner with the given diner id
export const updateDinerLocation = (dinerId, currentLocation) => {
  return dispatch => {
    axiosWithAuth()
      .put(`/diners/${dinerId}`, currentLocation)
      .then(res => {
        dispatch({ type: SET_USER, payload: res.data });
      })
      .catch(err => {
        dispatch({ type: ERROR, payload: err.message });
      });
  };
};

// Fetches an array of trucks for a diner with the given diner id
export const fetchFavoriteTrucks = dinerId => {
  return dispatch => {
    dispatch({ type: LOADING });
    axiosWithAuth()
      .get(`diners/${dinerId}/favoriteTrucks`)
      .then(res => {
        dispatch({ type: SET_FAVORITE_TRUCKS, payload: res.data });
      })
      .catch(err => {
        dispatch({ type: ERROR, payload: err.message });
      });
  };
};
// Add a truck to a diner's list of favorite trucks
export const addFavoriteTruck = (dinerId, truckId) => {
  return dispatch => {
    axiosWithAuth()
      .post(`/diners/${dinerId}/favoriteTrucks`, { truckId })
      .then(res => {
        console.log(res);
      })
      .catch(err => {
        dispatch({ type: ERROR, payload: err.message });
      });
  };
};

// Removes a favorite truck with a given truck id from a diner with a given diner id
export const deleteFavoriteTruck = (dinerId, truckId) => {
  console.log('Id object being created:', { truckId });
  return dispatch => {
    axiosWithAuth()
      .delete(`/diners/${dinerId}/favoriteTrucks`, { truckId })
      .then(res => {
        dispatch({ type: SET_FAVORITE_TRUCKS, payload: res.data });
      })
      .catch(err => {
        dispatch({ type: ERROR, payload: err.message });
      });
  };
};

// Adds (or replaces) a customer rating from a customer with a given diner id to a truck with a given truck id
export const addCustomerRating = (truckId, dinerId, rating) => {
  return dispatch => {
    axiosWithAuth()
      .post(`/trucks/${truckId}/customerRatings/${dinerId}`, {
        customerRating: rating,
      })
      .then(res => {
        dispatch({ type: UPDATE });
      })
      .catch(err => {
        dispatch({ type: ERROR, payload: err.message });
      });
  };
};

// Adds a rating to a given menu item with a given truck id from a diner with a given diner id
export const addCustomerMenuItemRating = (
  truckId,
  menuItemId,
  dinerId,
  rating
) => {
  return dispatch => {
    axiosWithAuth()
      .post(
        `/trucks/${truckId}/menu/${menuItemId}/customerRatings/${dinerId}`,
        {
          customerRating: rating,
        }
      )
      .then(res => {
        dispatch({ type: UPDATE });
      })
      .catch(err => {
        dispatch({ type: ERROR, payload: err.message });
      });
  };
};

export const findTruck = (truckLocation, redirectTo) => {
  return dispatch => {
    dispatch({ type: SET_FIND_TRUCK, payload: truckLocation });
    redirectTo('/map');
  };
};

// -------------------------------------------------------------------------
// --------------------------- Operators -----------------------------------
// -------------------------------------------------------------------------

//Fetch operator with a given operator id
export const fetchOperator = operatorId => {
  return dispatch => {
    dispatch({ type: LOADING });

    axiosWithAuth()
      .get(`/operators/${operatorId}`)
      .then(res => {
        dispatch({ type: SET_USER, payload: res.data });
      })
      .catch(err => {
        dispatch({ type: ERROR, payload: err.message });
      });
  };
};

//Fetch trucks owned for operator with a given operator id
export const fetchOperatorTruck = operatorId => {
  return dispatch => {
    axiosWithAuth()
      .get(`/operators/${operatorId}/trucksOwned`)
      .then(res => {
        dispatch({ type: FETCH_TRUCKS_OWNED, payload: res.data });
      })
      .catch(err => {
        dispatch({ type: ERROR, payload: err.message });
      });
  };
};
