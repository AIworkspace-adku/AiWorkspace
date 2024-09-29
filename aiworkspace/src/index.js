import React from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import Signin from './signup/signin/Signin';
import Register from './signup/register/Register';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route exact path="/" element={<App />} />
        <Route exact path="/signin" element={<Signin />} />
        <Route exact path="/register" element={<Register />} />
      </Routes>
    </Router>

  </React.StrictMode>
);


reportWebVitals();
