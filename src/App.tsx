import { ThemeProvider } from '@emotion/react';
import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import './App.css';
import RequireAuth from './components/RequireAuth';
import CreateOrEditUser from './pages/NewOrEditUser';
import Login from './pages/Login';
import Users from './pages/Users';
import lightTheme from './themes/light';
import Books from './pages/Books';
import EditBook from './pages/EditBook';
import CreateBook from './pages/NewBook';
import Analytics from './pages/Analytics';
import Notification from './components/notification';

function App() {
  return (
    <ThemeProvider theme={lightTheme}>
      <div className="App">
        <Routes>
          <Route
            path="/"
            element={
              <RequireAuth>
                <Navigate to="/books" replace />
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
                <RequireAuth onlyStaff>
                  <CreateOrEditUser />
                </RequireAuth>
              }
            />
            <Route
              path="create"
              element={
                <RequireAuth onlyStaff>
                  <CreateOrEditUser />
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
                <RequireAuth onlyStaff>
                  <EditBook />
                </RequireAuth>
              }
            />
            <Route
              path="create"
              element={
                <RequireAuth onlyStaff>
                  <CreateBook />
                </RequireAuth>
              }
            />
          </Route>
          <Route
            path="/analytics"
            element={
              <RequireAuth>
                <Analytics />
              </RequireAuth>
            }
          />
        </Routes>
        <Notification />
      </div>
    </ThemeProvider>
  );
}

export default App;
