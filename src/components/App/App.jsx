import { useEffect } from 'react';
import {
  HashRouter as Router,
  Route,
  Redirect,
  Switch,
} from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
// Components
import Nav from '../Nav/Nav';
import NavAdmin from '../NavAdmin/NavAdmin';
import Footer from '../Footer/Footer';
import ProtectedRoute from '../ProtectedRoute/ProtectedRoute';
import NewProfileContainer from '../NewProfileContainer/NewProfileContainer';
import LandingPage from '../LandingPage/LandingPage';
import LoginPage from '../LoginPage/LoginPage';
import ExploreView from '../ExploreView/ExploreView';
import SavedProviders from '../SavedProviders/SavedProviders';
import InterestedClients from '../InterestedClients/InterestedClients';
import EditClient from '../EditClient/EditClientRoot/EditClientRoot';
import EditProvider from '../EditProvider/EditProviderRoot/EditProviderRoot';
import HowItWorks from '../HowItWorks/HowItWorks';
import AdminPanel from '../AdminPanel/AdminPanel';
import ProviderDetails from '../ProviderDetails/ProviderDetails';
import AdminProviderQuestions from '../AdminProviderQuestions/AdminProviderQuestions';
import AdminUsersList from '../AdminUsersList/AdminUsersList';
import MessagingWidget from '../messaging/MessagingWidget/MessagingWidget';
import MessagingWindow from '../messaging/MessagingWindow/MessagingWindow';
// Mui imports and theme
import { ThemeProvider, CssBaseline } from '@material-ui/core/';
import theme from '../MuiTheme/MuiTheme';
import './App.css';

function App() {
  const dispatch = useDispatch();
  const { filled_out_form, user_type } = useSelector((store) => store.user);
  const { open } = useSelector((store) => store.messages.windowOpen);

  useEffect(() => {
    dispatch({ type: 'FETCH_USER' });
  }, [dispatch]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <div>
          {/* Displays a different Nav bar depending on user type */}
          {user_type === 'admin' ? <NavAdmin /> : <Nav />}
          {/* Messaging - only appears once a user has filled out their profile */}
          {filled_out_form && <MessagingWidget />}
          {/* Uses redux to check and see if MessagingWindow should be open */}
          {open && <MessagingWindow />}
          <Switch>
            {/* Visiting localhost:3000 will redirect to localhost:3000/home */}
            <Redirect exact from="/" to="/home" />
            <Route
              // Shows HowItWorks at all times (logged in or not)
              exact
              path="/how_it_works"
            >
              <HowItWorks />
            </Route>
            {/* For protected routes, the view could show one of several things on the same route.
            Visiting localhost:3000/user will show the UserPage if the user is logged in.
            If the user is not logged in, the ProtectedRoute will show the LoginPage (component).
            Even though it seems like they are different pages, the user is always on localhost:3000/user */}
            <ProtectedRoute
              // Logged in shows one of three components based on user_type:
              // client: ExploreView, Provider: InterestedClients,
              // admin: AdminPanel,
              // else shows LoginPage
              exact
              path="/user"
            >
              {user_type === 'admin' ? (
                <AdminPanel />
              ) : user_type === 'client' ? (
                <ExploreView />
              ) : (
                <InterestedClients />
              )}
            </ProtectedRoute>
            <ProtectedRoute
              // Logged in shows ProviderDetails else shows LoginPage
              exact
              path="/provider-details/:id"
            >
              <ProviderDetails />
            </ProtectedRoute>
            <ProtectedRoute
              // Logged in shows NewProfileContainer else shows LoginPage
              exact
              path="/new-profile/:page"
            >
              <NewProfileContainer />
            </ProtectedRoute>
            {/* When a value is supplied for the authRedirect prop the user will
            be redirected to the path supplied when logged in, otherwise they will
            be taken to the component and path supplied. */}
            <ProtectedRoute
              // With authRedirect:
              // - if logged in, redirects to "/user"
              // - else shows LoginPage at /login
              exact
              path="/login"
              authRedirect="/user"
            >
              <LoginPage />
            </ProtectedRoute>
            <ProtectedRoute
              // With authRedirect:
              // - if logged in, redirects to "/user"
              // - else shows LandingPage at "/home"
              exact
              path="/home"
              authRedirect="/user"
            >
              <LandingPage />
            </ProtectedRoute>
            <ProtectedRoute exact path="/explore">
              <ExploreView />
            </ProtectedRoute>
            <ProtectedRoute exact path="/saved_providers">
              <SavedProviders />
            </ProtectedRoute>
            <ProtectedRoute exact path="/interested_clients">
              <InterestedClients />
            </ProtectedRoute>
            <ProtectedRoute exact path="/edit_profile">
            {/* Uses 'edit_profile' route for both EditClient and 
            EditProvider, renders based on user_type */}
              {user_type === 'client' ? <EditClient /> : <EditProvider />}
            </ProtectedRoute>
            {
              // Protected routes for admin pages
              user_type === 'admin' && (
                <>
                  <ProtectedRoute exact path="/admin">
                    <AdminPanel />
                  </ProtectedRoute>
                  <ProtectedRoute exact path="/admin-questions">
                    <AdminProviderQuestions />
                  </ProtectedRoute>
                  <ProtectedRoute exact path="/admin-users">
                    <AdminUsersList />
                  </ProtectedRoute>
                </>
              )
            }
            {/* If none of the other routes matched, we will show a 404. */}
            <Route>
              <h1>404</h1>
            </Route>
          </Switch>
          <Footer />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
