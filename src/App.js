import React, { lazy, Suspense } from "react";
import { Route, Router, Switch } from "react-router-dom";
import history from "./history";
import Spinner from "./components/spinner/spinner.component";
import Frame from './components/frame/frame.container';

const MainPage = lazy(() => import("./pages/main-page/main-page.container"));
const ProfilePage = lazy(() => import("./pages/profile-page/profile-page.page"));
const shareLink = lazy(() => import("./pages/sharelink-page/shraelink.page"));

const App = () => {
  const FrameLayout = (Component, props) => {
    return <Frame>
      <Component {...props}/>
    </Frame>
  }
  return (
    <Router history={history}>
      <Suspense fallback={<Spinner />}>
        <Switch>
          <Route path="/" exact render={props => FrameLayout(MainPage, props)} />
          <Route path="/profile-page" render={props => FrameLayout(ProfilePage, props)} exact />
          <Route path="/:id" component={shareLink} exact/>
        </Switch>
      </Suspense>
    </Router>
  );
}

export default App;