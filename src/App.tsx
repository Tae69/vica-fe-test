import { ThemeProvider } from '@emotion/react';
import React from 'react';
import { Navigate } from 'react-router-dom';
import { Routes, Route, Link } from "react-router-dom";
import './App.css';
import RequireAuth from './components/RequireAuth';
import Dashboard from './pages/dashboard';
import Login from './pages/Login';
import lightTheme from './themes/light';

function App() {
  return (
    <ThemeProvider theme={lightTheme}>
      <div className="App">
        <Routes>
          <Route path="/" element={<Navigate to="/login" />}>
          </Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/dashboard" element={(
            <RequireAuth>
              <Dashboard />
            </RequireAuth>
          )}
          ></Route>
        </Routes>
      </div >
    </ThemeProvider >
  )
}

export default App;
