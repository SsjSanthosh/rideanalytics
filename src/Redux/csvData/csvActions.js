export const addData = data => {
  return {
    type: "ADD_DATA",
    payload: data
  };
};

export const removeData = () => {
  return {
    type: "REMOVE_DATA"
  };
};
