import React from 'react';
import ReactDOM from 'react-dom';
import reportWebVitals from './reportWebVitals';
import App from "./App";
import {Provider} from "react-redux";
import {store} from "./components/state/store";
import {BrowserRouter} from "react-router-dom";
import './components/features/Translation/i18n'

ReactDOM.render(
    <BrowserRouter>
        <Provider store={store}>
            <App/>
        </Provider>
    </BrowserRouter>,
    document.getElementById('root')
);

reportWebVitals();
