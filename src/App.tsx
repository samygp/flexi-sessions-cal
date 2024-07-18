import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Login from './views/Login';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
import { CircularProgress, CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import Calendar from './views/Calendar';
import SessionContextProvider from './components/ContextProviders/SessionContextProvider';
import { useContext, useMemo } from 'react';
import SessionContext from './models/SessionContext';
import Header from './components/Header';

const defaultTheme = createTheme();

const basePath = "/flexi-sessions-cal";
const PATHS = {
  CALENDAR: `${basePath}/calendar`,
  LOGIN: `${basePath}/login`
}

function AppRoutes() {
  const { authState } = useContext(SessionContext);
  const isAuthenticated = useMemo(() => authState === "authenticated", [authState]);

  if (authState === "loading") return <CircularProgress />;
  return (
    <>
      <Header />
      <BrowserRouter >
        <Routes>
          <Route path="/" element={<Navigate replace to={basePath} />} />
          <Route path={basePath} index element={isAuthenticated 
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
      </BrowserRouter>
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
