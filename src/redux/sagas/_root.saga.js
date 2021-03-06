import { all } from 'redux-saga/effects';
import loginSaga from './login.saga';
import registrationSaga from './registration.saga';
import userSaga from './user.saga';
import formsSaga from './forms.saga';
import exploreSaga from './explore.saga';
import providerDetailsSaga from './providerDetails.saga';
import savedProvidersSaga from './savedProviders.saga';
import editProfileSaga from './editProfile.saga';
import interestedClientsSaga from './interestedClients.saga';
import messagesSaga from './messages.saga';

// rootSaga is the primary saga.
// It bundles up all of the other sagas so our project can use them.
// This is imported in index.js as rootSaga

// some sagas trigger other sagas, as an example
// the registration triggers a login
// and login triggers setting the user
export default function* rootSaga() {
  yield all([
    loginSaga(), // login saga is now registered
    registrationSaga(),
    userSaga(),
    formsSaga(), // handles all dispatches regarding forms
    exploreSaga(), // GETS provider data for ExploreView
    providerDetailsSaga(), // Handles all dispatches regarding individual providers
    savedProvidersSaga(), // GETS provider data for SavedProviders view
    editProfileSaga(), // handles tasks involving editing any profile
    interestedClientsSaga(), // saga that calls api router to GET interested client using provider's user id
    messagesSaga(), // GET route for all messages on db for logged in user
  ]);
}
