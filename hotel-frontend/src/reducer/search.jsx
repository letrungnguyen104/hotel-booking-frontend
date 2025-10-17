const initialState = {
  address: null,
  dates: [null, null],
  guests: 2,
};

const searchReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_SEARCH_PARAMS':
      localStorage.setItem('lastSearch', JSON.stringify(action.payload));
      return {
        ...state,
        ...action.payload
      };
    case 'CLEAR_SEARCH_PARAMS':
      localStorage.removeItem('lastSearch');
      return initialState;
    default:
      const lastSearch = localStorage.getItem('lastSearch');
      return lastSearch ? JSON.parse(lastSearch) : state;
  }
};

export default searchReducer;