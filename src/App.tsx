import React from 'react';
import logo from './logo.svg';
import './App.css';
import Login from './views/Login';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';

const defaultTheme = createTheme();

function App() {
  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />
      <LocalizationProvider dateAdapter={AdapterMoment}>
        <Login />
      </LocalizationProvider>
    </ThemeProvider>
  );
}

export default App;
