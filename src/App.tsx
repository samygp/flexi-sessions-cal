import { Routes, Route, Navigate, HashRouter } from 'react-router-dom';
import './App.css';
import Login from './views/Login';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
import { CircularProgress, CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import Calendar from './views/EventCalendarView';
import SessionContextProvider from './components/ContextProviders/SessionContextProvider';
import { useContext, useMemo } from 'react';
import Header from './components/Header';
import SessionContext from './shared/models/SessionContext';

const defaultTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

const PATHS = {
  CALENDAR: `/calendar`,
  LOGIN: `/login`
}

function AppRoutes() {
  const { authState } = useContext(SessionContext);
  const isAuthenticated = useMemo(() => authState === "authenticated", [authState]);

  if (authState === "loading") return <CircularProgress />;
  return (
    <>
      <Header />
      <HashRouter>
        <Routes>
          <Route index element={isAuthenticated
            ? <Navigate replace to={PATHS.CALENDAR} />
            : <Navigate replace to={PATHS.LOGIN} />}
          />
          <Route path={PATHS.LOGIN} element={isAuthenticated
            ? <Navigate replace to={PATHS.CALENDAR} />
            : <Login />}
          />
          <Route path={PATHS.CALENDAR} element={isAuthenticated
            ? <Calendar />
            : <Navigate replace to={PATHS.LOGIN} />}
          />
        </Routes>
      </HashRouter>
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
