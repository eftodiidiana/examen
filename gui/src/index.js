import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

import 'primereact/resources/themes/lara-light-indigo/theme.css'; 
import 'primereact/resources/primereact.min.css';                  
import 'primeicons/primeicons.css';   
import 'primeflex/primeflex.css';   
import 'bootstrap/dist/css/bootstrap.css'

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);