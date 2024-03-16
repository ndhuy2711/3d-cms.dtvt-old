import { HashRouter, Route, Switch, Redirect } from "react-router-dom";
import AdminLayout from "layouts/admin";
import LoginPage from "layouts/login";
import React, { Suspense } from "react";
import { useContext } from "react";
import { AppContext } from "./Context";

function App() {
  // function GetToken () {
  //   const getValueJWT = useSelector((state) => state.auth.value);
  //   // const dispatch = useDispatch()
  //   if (getValueJWT === "") {
  //     return false;
  //   } else {
  //     // const getJWTToken = localStorage.getItem('dtvt');
  //     // dispatch(checkAuth(getJWTToken))
  //     return true;
  //   }
  // };
  const { isLogin } = useContext(AppContext);
  console.log("isLogin", isLogin)
  return (
    <>
      {isLogin ? (
        <HashRouter>
          <Suspense fallback={<div>Loading...</div>}>
            <Switch>
              <Route path={`/admin`} component={AdminLayout} />
              <Route path="/admin/list-business" component={AdminLayout} />
              <Route path="/admin/list-product" component={AdminLayout} />
              <Route
                path="/admin/list-product/detail-product"
                component={AdminLayout}
              />
              <Redirect from="/" to="/admin/list-business" />
            </Switch>
          </Suspense>
        </HashRouter>
      ) : (
        <HashRouter>
          <Switch>
            <Route path={`/login`} component={LoginPage} />
            <Redirect from="*" to="/login" />
          </Switch>
        </HashRouter>
      )}
    </>
  );
}

export default App;
