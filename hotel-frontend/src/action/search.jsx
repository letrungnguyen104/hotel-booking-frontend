export const setSearchParams = (params) => {
  return {
    type: 'SET_SEARCH_PARAMS',
    payload: params
  };
};

export const clearSearchParams = () => {
  return {
    type: 'CLEAR_SEARCH_PARAMS'
  };
};