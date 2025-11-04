const initialState = {
  city: null,
  dates: [null, null],
  guests: 2,
};

const loadState = () => {
  try {
    const lastSearch = localStorage.getItem('lastSearch');
    if (lastSearch === null) {
      return initialState;
    }
    const parsedState = JSON.parse(lastSearch);
    return {
      city: parsedState.city || parsedState.address || null,
      dates: parsedState.dates || [null, null],
      guests: parsedState.guests || 2
    };
  } catch (err) {
    return initialState;
  }
};

const searchReducer = (state = loadState(), action) => {
  switch (action.type) {
    case 'SET_SEARCH_PARAMS':
      const { address, city, ...rest } = action.payload;
      const newState = {
        ...state,
        ...rest,
        city: city !== undefined ? city : address,
      };
      localStorage.setItem('lastSearch', JSON.stringify(newState));
      return newState;
    case 'CLEAR_SEARCH_PARAMS':
      localStorage.removeItem('lastSearch');
      return initialState;
    default:
      return state;
  }
};

export default searchReducer;