export const addMonthlyData = data => {
  return {
    type: "ADD_MONTHLY_DATA",
    payload: data
  };
};

export const addHourlyData = data => {
  console.log("here");
  return {
    type: "ADD_HOURLY_DATA",
    payload: data
  };
};

export const addBookingData = data => {
  return {
    type: "ADD_BOOKING_DATA",
    payload: data
  };
};
