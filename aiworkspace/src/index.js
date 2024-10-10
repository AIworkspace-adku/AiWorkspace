import React from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import Signin from './signup/signin/Signin';
import Register from './signup/register/Register';
import Docs from './documentation/Docs'
import White from './whiteboard/White';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route exact path="/" element={<App />} />
        <Route exact path="/signin" element={<Signin />} />
        <Route exact path="/register" element={<Register />} />
        <Route exact path="/docs" element={<Docs />} />
        <Route exact path="/whiteboard" element={<White />} />
      </Routes>
    </Router>

  </React.StrictMode>
);


reportWebVitals();
