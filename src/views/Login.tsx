import Avatar from '@mui/material/Avatar';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Doge from "../assets/doge_splash.png";
import LoginForm from '@/components/Inputs/Forms/LoginForm';
import { useHeaderContext } from '@/hooks/useCustomContext';
import { useMount } from 'react-use';

export default function Login() {
  const {setTitle} = useHeaderContext();
  useMount(() => {
    setTitle('Login');
});
  return (
      <Grid container component="main" sx={{ height: '100vh' }}>
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage: `url(${Doge})`,
            backgroundRepeat: 'repeat',
            backgroundSize: 'contain',
            backgroundPosition: 'center',
          }}
        />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Avatar sx={{ m: 1 }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign in
            </Typography>
            <LoginForm />
          </Box>
        </Grid>
      </Grid>
  );
}