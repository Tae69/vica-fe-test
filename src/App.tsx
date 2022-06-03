import { ThemeProvider } from '@emotion/react';
import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import './App.css';
import RequireAuth from './components/RequireAuth';
import Login from './pages/Login';
import Users from './pages/Users';
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
                <Navigate to="/users" replace />
              </RequireAuth>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/users">
            <Route
              index
              element={
                <RequireAuth>
                  <Users />
                </RequireAuth>
              }
            />
          </Route>
        </Routes>
      </div>
    </ThemeProvider>
  );
}

export default App;
