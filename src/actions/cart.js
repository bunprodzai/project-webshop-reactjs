

export const updateCartLength = (length) => {
  return {
    type: "UPDATE_CART_LENGTH",
    payload: length, // Giá trị mới của lengthCart
  };
};
