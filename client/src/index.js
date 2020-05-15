import React from "react"
import ReactDOM from "react-dom"
import { Route, Switch, Redirect, Router } from "react-router-dom"
import 'antd/dist/antd.dark.less';
import "moment/locale/ru"
import history from "./history"

import AuthenticationProvider from "./services/authentication.service"
// import * as Sentry from "@sentry/browser"
// if (process.env.NODE_ENV && process.env.NODE_ENV !== "development") {
//   Sentry.init({
//     dsn: "https://5b0198d501434b36a2caddcdfae52308@sentry.io/1729427"
//   })
//   Sentry.configureScope((scope) => {
//     scope.setUser({
//       "user": localStorage.getItem("user"),
//       "parlor": localStorage.getItem("parlor")
//     })
//   })
// }

import { PageLoader } from "./shared/components"

const App = React.lazy(() => import("./App"))
const Authentication = React.lazy(() => import("./pages/Authentication"))


ReactDOM.render(
  <React.Suspense fallback={<PageLoader />}>
    <AuthenticationProvider>
      <Router history={history}>
        <Switch>
          <Route path="/login" exact render={props => <Authentication {...props} />} />
          <Route path="/" render={props => <App {...props} />} />
          <Route path="*">
            <Redirect to="/" />
          </Route>
        </Switch>
      </Router>
    </AuthenticationProvider>
  </React.Suspense>,
  document.getElementById("root")
)