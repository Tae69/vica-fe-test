import { ThemeProvider } from '@emotion/react';
import React from 'react';
import { Routes, Route } from 'react-router-dom';
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
          <Route
            path="/"
            element={
              <RequireAuth>
                <Dashboard />
              </RequireAuth>
            }
          />
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
    </ThemeProvider>
  );
}

export default App;
