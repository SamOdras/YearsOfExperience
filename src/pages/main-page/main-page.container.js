import MainPage from './main-page.page';
import { connect } from "react-redux";


const setNotification = e => ({
  type: "TOGGLE_NOTIFICATION",
  payload: e
});
const setDataDraft = e => ({
  type: "SAVE_DRAFT",
  payload: e
});

const mapStateToProps = state => state.Main;
const mapDispatchToProps = dispatch => ({
  setNotification: e => dispatch(setNotification(e)),
  setDataDraft: e => dispatch(setDataDraft(e)),
});

const combinedMainPage = connect(mapStateToProps, mapDispatchToProps)(MainPage)
export default combinedMainPage;