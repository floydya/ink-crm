import React, { useContext, useEffect } from "react";
import { Route, Redirect, Switch, useLocation } from "react-router-dom";
import { PageLoading } from "@ant-design/pro-layout";
import useApi from "./shared/hooks/api";
import { authenticationActions } from "./store/actions";
import pubsub from "sweet-pubsub";
import { AuthenticationContext } from "./services/authentication.service";
import Layout from "./layouts/index.jsx";

const Dashboard = React.lazy(() => import("pages/Dashboard"));
const RecordDetail = React.lazy(() => import("pages/Records/Detailed"));
const RecordForm = React.lazy(() => import("pages/Records/Create"));
const CreateUserPage = React.lazy(() =>
  import("pages/Employees/CreateUserPage")
);
const HomePage = React.lazy(() => import("pages/Home"));
const Profile = React.lazy(() => import("pages/Profile"));
const Employees = React.lazy(() => import("pages/Employees"));
const CustomerCreate = React.lazy(() => import("pages/Customer/Create"));
const CustomerCreateForm = React.lazy(() =>
  import("pages/Customer/Create/CustomerCreateForm")
);
const CustomerDetail = React.lazy(() => import("pages/Customer/Detail"));

const App = () => {
  const { pathname } = useLocation();

  const { dispatch, loggedIn: isAuthenticated } = useContext(
    AuthenticationContext
  );
  const [{ data }, fetchUser] = useApi.get("/auth/current/");
  useEffect(() => {
    if (isAuthenticated) {
      fetchUser();
      pubsub.on("fetch-user", fetchUser);
    }
    return () => {
      pubsub.off("fetch-user", fetchUser);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(
    () => {
      dispatch(authenticationActions.fetchUser(data));
    },
    [data] // eslint-disable-line react-hooks/exhaustive-deps
  );

  if (!isAuthenticated) return <Redirect to={`/login?next=${pathname}`} />;

  if (!data) return <PageLoading tip={"Загрузка..."} />;

  return (
    <React.Suspense fallback={<PageLoading tip={"Загрузка..."} />}>
      <Layout>
        <Switch>
          <Route path="/home" render={() => <HomePage />} />
          <Route path="/dashboard" render={() => <Dashboard />} />
          <Route path="/customers" exact render={() => <CustomerCreate />} />
          <Route
            path="/customers/:customerId"
            exact
            render={() => <CustomerDetail />}
          />
          <Route
            path="/customers/create/:phoneNumber"
            exact
            render={() => <CustomerCreateForm />}
          />
          <Route
            path="/records/create/:customerId"
            exact
            render={() => <RecordForm />}
          />
          <Route
            path="/records/:recordId"
            exact
            render={() => <RecordDetail />}
          />
          <Route
            path="/employees/create"
            exact
            render={() => <CreateUserPage />}
          />
          {/* <Route
            path="/employees/:employeeId/motivations"
            exact
            render={() => <Motivation />}
          /> */}
          <Route
            path="/employees/:employeeId"
            exact
            render={() => <Profile />}
          />
          {/* <Route path="/employees/:employeeId/bounties/create" exact render={() => <BountyCreateForm />} /> */}
          <Route path="/employees" exact render={() => <Employees />} />
          <Redirect to="/home" />
        </Switch>
      </Layout>
    </React.Suspense>
  );
};

export default App;
