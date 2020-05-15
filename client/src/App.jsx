import React, { useContext, useEffect } from "react"
import { Route, Redirect, Switch, useLocation } from "react-router-dom"
import useApi from "./shared/hooks/api"
import { PageLoader } from "./shared/components"
import { authenticationActions } from "./store/actions"
import pubsub from "sweet-pubsub"
import { AuthenticationContext } from "./services/authentication.service"
import CreateRecord from "./pages/Records/Create"
import RecordDetail from "./pages/Records/Detail"
import Dashboard from "pages/Dashboard"
import Layout from "./layouts/index.jsx"

const HomePage = React.lazy(() => import("./pages/Home"))
const Profile = React.lazy(() => import("./pages/Profile"))
const Motivation = React.lazy(() => import("./pages/Profile/Motivation"))
const Employees = React.lazy(() => import("./pages/Employees"))
const CustomerCreate = React.lazy(() => import("./pages/Customer/Create"))
const CustomerCreateForm = React.lazy(() => import("./pages/Customer/Create/CustomerCreateForm"))
const CustomerDetail = React.lazy(() => import("./pages/Customer/Detail"))

const App = () => {
  const { pathname } = useLocation()

  const { dispatch, loggedIn: isAuthenticated } = useContext(
    AuthenticationContext
  )
  const [{ data }, fetchUser] = useApi.get("/auth/current/")
  useEffect(() => {
    if (isAuthenticated) {
      fetchUser()
      pubsub.on("fetch-user", fetchUser)
    }
    return () => {
      pubsub.off("fetch-user", fetchUser)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    dispatch(authenticationActions.fetchUser(data))
  }, [data]) // eslint-disable-line react-hooks/exhaustive-deps

  if (!isAuthenticated) return <Redirect to={`/login?next=${pathname}`} />

  if (!data) return <PageLoader />

  return (
    <Layout>
      <React.Suspense fallback={<PageLoader />}>
        <Switch>
          <Route path="/home" render={() => <HomePage />} />
          <Route path="/dashboard" render={() => <Dashboard />} />
          <Route path="/customers" exact render={() => <CustomerCreate />} />
          <Route path="/customers/:customerId" exact render={() => <CustomerDetail />} />
          <Route path="/customers/create/:phoneNumber" exact render={() => <CustomerCreateForm />} />
          <Route path="/records/create/:customerId" exact render={() => <CreateRecord />} />
          <Route path="/records/:recordId" exact render={() => <RecordDetail />} />
          <Route
            path="/employees/:employeeId/motivations"
            exact
            render={() => <Motivation />}
          />
          <Route path="/employees/:employeeId" exact render={() => <Profile />} />
          <Route path="/employees" exact render={() => <Employees />} />
          <Redirect to="/home" />
        </Switch>
      </React.Suspense>
    </Layout>
  )
}

export default App
