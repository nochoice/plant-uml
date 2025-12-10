import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';

interface LoadingIndicatorProps {
  activeStep: number;
}

export default function LoadingIndicator({ activeStep }: LoadingIndicatorProps) {
  return (
    <Box sx={{ width: '100%', maxWidth: 600, mt: 2 }}>
      <LinearProgress />
      <Typography variant="body2" color="text.secondary" sx={{ mt: 1, textAlign: 'center' }}>
        {activeStep === 1 && 'Uploading image...'}
        {activeStep === 2 && 'Analyzing with AI...'}
        {activeStep === 3 && 'Generating PlantUML diagram...'}
      </Typography>
    </Box>
  );
}
