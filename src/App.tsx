import { Routes, Route, Navigate, HashRouter } from 'react-router-dom';
import './App.css';
import Login from './views/Login';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
import { CircularProgress, CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import SessionContextProvider from './components/ContextProviders/SessionContextProvider';
import Header from './components/Header';
import { getPath, PathName } from './shared/models/Routes';
import MainView from './views/MainView';
import { useSessionContext } from './hooks/useCustomContext';
import ElementOrLogin from './components/Other/ElementOrLogin';
import { useMemo } from 'react';

const defaultTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

function AppRoutes() {
  const { isAuthenticated, authState } = useSessionContext();
  const loginPath = useMemo(() => getPath(PathName.login), []);
  const appPath = useMemo(() => getPath(PathName.app), []);

  if (authState === "loading") return <CircularProgress />;
  return (
    <>
      <HashRouter>
        <Header />
        <Routes>
          <Route index element={<ElementOrLogin element={<Navigate replace to={loginPath} />} />} />
          {/* Actual Login Route Component */}
          <Route path={PathName.login} element={isAuthenticated ? <Navigate replace to={appPath} /> : <Login />} />
          <Route path={`${appPath}/*`} element={<ElementOrLogin element={<MainView />} />} />
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
