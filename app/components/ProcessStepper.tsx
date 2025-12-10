import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';

interface ProcessStepperProps {
  activeStep: number;
}

const steps = [
  'Select Image',
  'Upload & Process',
  'AI Analysis',
  'Generate Diagram'
];

export default function ProcessStepper({ activeStep }: ProcessStepperProps) {
  return (
    <Box sx={{ width: '100%', maxWidth: 600, mb: 4 }}>
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
}
