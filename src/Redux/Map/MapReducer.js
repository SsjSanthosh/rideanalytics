const INITIAL_STATE = {
  monthlyData: [],
  hourlyData: [],
  bookingData: [],
  distanceData: [],
  travelTypeData: []
};
const mapReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case "ADD_MONTHLY_DATA":
      return { ...state, monthlyData: action.payload };
    case "ADD_HOURLY_DATA":
      return { ...state, hourlyData: action.payload };
    case "ADD_BOOKING_DATA":
      return { ...state, bookingData: action.payload };
    case "ADD_DISTANCE_DATA":
      return { ...state, distanceData: action.payload };
    case "ADD_TRAVEL_TYPE_DATA":
      return { ...state, travelTypeData: action.payload };
    default:
      return state;
  }
};

export default mapReducer;
