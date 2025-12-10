import * as React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import { Link as ReactRouterLink } from 'react-router';

export default function Ooo() {
  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          my: 4,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Typography variant="h4" component="h1" sx={{ mb: 2 }}>
          Ooo Page
        </Typography>
        <Link to="/ooo/ufff" color="secondary" component={ReactRouterLink}>
          Go to Ufff
        </Link>
        <br />
        <Link to="/" color="secondary" component={ReactRouterLink}>
          Go back home
        </Link>
      </Box>
    </Container>
  );
}
