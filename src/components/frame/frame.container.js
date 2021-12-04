import Frame from './frame.component';
import { connect } from "react-redux";

const onChangeSearch = e => ({
  type: "SEARCH_PROFILE",
  payload: e
})
const setNotification = e => ({
  type: "TOGGLE_NOTIFICATION",
  payload: e
});
const setIdUser = e => ({
  type: "SET_ID_USER",
  payload: e
})
const setToggleView = e => ({
  type: "TOGGLE_VIEW",
  payload: e
})
const resetData = () => ({ type: "RESET_DATA" })

const mapStateToProps = state => state.Main
const mapDispatchToProps = dispatch => ({
  onChangeSearch: e => dispatch(onChangeSearch(e)),
  setNotification: e => dispatch(setNotification(e)),
  setIdUser: e => dispatch(setIdUser(e)),
  setToggleView: e => dispatch(setToggleView(e)),
  resetData: () => dispatch(resetData())
});

const CombinedFrame = connect(mapStateToProps, mapDispatchToProps)(Frame)
export default CombinedFrame;
