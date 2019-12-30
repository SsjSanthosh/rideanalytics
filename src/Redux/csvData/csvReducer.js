const INITIAL_STATE = [];
const csvReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case "ADD_DATA":
      return { data: action.payload };
    default:
      return state;
  }
};

export default csvReducer;
