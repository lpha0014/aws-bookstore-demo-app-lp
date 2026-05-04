import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App';
import { Amplify } from 'aws-amplify';
import config from './config';

import 'bootstrap/dist/css/bootstrap.min.css';

Amplify.configure({
  API: {
    REST: {
      books: { endpoint: config.apiGateway.API_URL, region: config.apiGateway.REGION },
      cart: { endpoint: config.apiGateway.API_URL, region: config.apiGateway.REGION },
      orders: { endpoint: config.apiGateway.API_URL, region: config.apiGateway.REGION },
      search: { endpoint: config.apiGateway.API_URL, region: config.apiGateway.REGION },
      bestsellers: { endpoint: config.apiGateway.API_URL, region: config.apiGateway.REGION },
    }
  }
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
