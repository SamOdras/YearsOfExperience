import ProfilePage from './profile-page.page';
import { connect } from 'react-redux';

const setNotification = e => ({
  type: "TOGGLE_NOTIFICATION",
  payload: e
});
const mapStateToProps = state => state.Main;
const combinedProfilePage = connect(mapStateToProps, { setNotification })(ProfilePage);
export default combinedProfilePage;