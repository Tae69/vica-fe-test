import { ThemeProvider } from '@emotion/react';
import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import './App.css';
import RequireAuth from './components/RequireAuth';
import EditUser from './pages/EditUser';
import CreateUser from './pages/NewUser';
import Login from './pages/Login';
import Users from './pages/Users';
import lightTheme from './themes/light';
import Books from './pages/Books';
import EditBook from './pages/EditBook';
import CreateBook from './pages/NewBook';

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
            <Route
              path=":userId/edit"
              element={
                <RequireAuth>
                  <EditUser />
                </RequireAuth>
              }
            />
            <Route
              path="create"
              element={
                <RequireAuth>
                  <CreateUser />
                </RequireAuth>
              }
            />
          </Route>
          <Route path="/books">
            <Route
              index
              element={
                <RequireAuth>
                  <Books />
                </RequireAuth>
              }
            />
            <Route
              path=":bookId/edit"
              element={
                <RequireAuth>
                  <EditBook />
                </RequireAuth>
              }
            />
            <Route
              path="create"
              element={
                <RequireAuth>
                  <CreateBook />
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
