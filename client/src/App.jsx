import React, { useContext, useEffect } from "react"
import { Route, Redirect, Switch, useLocation } from "react-router-dom"
import { ProjectPage } from "./layout/Styles"
import useApi from "./shared/hooks/api"
import { PageLoader, Modal } from "./shared/components"
import { authenticationActions } from "./store/actions"
import { createQueryParamModalHelpers } from "./shared/utils/queryParamModal"
import pubsub from "sweet-pubsub"
import { AuthenticationContext } from "./services/authentication.service"
import CreateRecord from "./pages/Records/Create"
import RecordDetail from "./pages/Records/Detail"
import Dashboard from "pages/Dashboard"

const HomePage = React.lazy(() => import("./pages/Home"))
const NavbarLeft = React.lazy(() => import("./layout/NavbarLeft"))
const Sidebar = React.lazy(() => import("./layout/Sidebar"))
const Notifications = React.lazy(() => import("./layout/Notifications"))
const Settings = React.lazy(() => import("./layout/Settings"))
const Profile = React.lazy(() => import("./pages/Profile"))
const Motivation = React.lazy(() => import("./pages/Profile/Motivation"))
const Employees = React.lazy(() => import("./pages/Employees"))
const CustomerCreate = React.lazy(() => import("./pages/Customer/Create"))
const CustomerCreateForm = React.lazy(() => import("./pages/Customer/Create/CustomerCreateForm"))
const CustomerDetail = React.lazy(() => import("./pages/Customer/Detail"))

const App = () => {
  const { pathname } = useLocation()

  const notificationsModalHelpers = createQueryParamModalHelpers(
    "notifications"
  )
  const settingsModalHelpers = createQueryParamModalHelpers("settings")

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
    <ProjectPage id="container">
      <NavbarLeft
        notificationsModalOpen={notificationsModalHelpers.open}
        settingsModalOpen={settingsModalHelpers.open}
      />
      <Sidebar />

      {notificationsModalHelpers.isOpen() && (
        <Modal
          isOpen
          testid="modal:notifications"
          variant="aside"
          width={600}
          onClose={notificationsModalHelpers.close}
          renderContent={({ $scrollOverlayRef, $clickableOverlayRef }) => (
            <Notifications
              $scrollOverlayRef={$scrollOverlayRef}
              $clickableOverlayRef={$clickableOverlayRef}
            />
          )}
        />
      )}

      {settingsModalHelpers.isOpen() && (
        <Modal
          isOpen
          testid="modal:settings"
          width={1200}
          withCloseIcon={true}
          onClose={settingsModalHelpers.close}
          renderContent={modal => <Settings modalClose={modal.close} />}
        />
      )}
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
    </ProjectPage>
  )
}

export default App
