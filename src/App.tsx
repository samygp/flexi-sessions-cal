import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Login from './views/Login';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
import { CircularProgress, CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import Calendar from './views/Calendar';
import useAuthSession from './hooks/useAuthSession';
import SessionContextProvider from './components/ContextProviders/SessionContextProvider';
import RefreshDialog from './components/login/RefreshDialog';

const defaultTheme = createTheme();

function AppRoutes() {
  const { authLoading, isAuthenticated, shouldRefresh, refreshSession, logout } = useAuthSession();
  return (
    <>
      {authLoading ? <CircularProgress />
        : (
          <BrowserRouter >
            <RefreshDialog open={shouldRefresh} onConfirm={refreshSession} onCancel={logout} />
            <Routes>
              <Route path="/" element={<Navigate replace to="/flexi-sessions-cal" />} />
              <Route path="/flexi-sessions-cal">
                <Route index element={isAuthenticated ? <Navigate replace to="calendar" /> : <Navigate replace to="login" />} />
                <Route path="login" element={<Login />} />
                <Route path="calendar" element={isAuthenticated ? <Calendar /> : <Navigate replace to="login" />} />
              </Route>
            </Routes>
          </BrowserRouter>
        )}
    </>
  );
}

function App() {
  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />
      <LocalizationProvider dateAdapter={AdapterMoment}>
        <SessionContextProvider>
          <AppRoutes />
        </SessionContextProvider>
      </LocalizationProvider>
    </ThemeProvider>
  );
}

export default App;
