const init = {
  searchValue: "",
  notificationMessage: "",
  notificationStatus: "",
  notificationIcon: "",
  payload:{},
  idUser: "",
  toggleView: "edit"
};

const Main = (state = init, action) => {
  switch (action.type) {
    case "RESET_DATA":
      return init
    case "TOGGLE_VIEW":
      return {
        ...state,
        toggleView: action.payload
      }
    case "SEARCH_PROFILE":
      return {
        ...state,
        searchValue: action.payload
      };
    case "TOGGLE_NOTIFICATION":
      return {
        ...state,
        notificationMessage: action.payload.message,
        notificationStatus: action.payload.status,
        notificationIcon: action.payload.icon
      };
    case "SAVE_DRAFT":
      return {
        ...state,
        payload: action.payload
      }
    case "SET_ID_USER":
      return {
        ...state,
        idUser: action.payload
      }
    default:
      return state;
  }
};

export default Main;
