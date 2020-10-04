import React from "react";
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import createSagaMiddleware from "redux-saga";
import runAllSagas from "../sagas";
import rootReducer from "../rootReducer";
import ReduxApp from "./ReduxApp";

const sagaMiddleware = createSagaMiddleware();
const store = createStore(rootReducer, applyMiddleware(sagaMiddleware));

sagaMiddleware.run(runAllSagas);

// Create main App component
function App() {
  return (
    <React.StrictMode>
      <Provider store={store}>
        <ReduxApp />
      </Provider>
    </React.StrictMode>
  );
}

// Export the App component
export default App;
