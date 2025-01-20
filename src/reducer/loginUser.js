
export const loginUserReducers = (state = false, actions) => {
  switch (actions.type) {
    case "CHECK_LOGIN_USER":
      return actions.status;
  
    default:
      return state;
  }
}