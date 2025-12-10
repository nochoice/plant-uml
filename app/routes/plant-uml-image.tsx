import * as React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import LinearProgress from '@mui/material/LinearProgress';
import Alert from '@mui/material/Alert';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import { Link as ReactRouterLink, Form, useActionData, useNavigation } from 'react-router';
import type { Route } from './+types/plant-uml-image';
import { analyzeImageWithOpenAI } from '~/domains/openAI';
import { generatePlantUmlImageUrl } from '~/domains/plantUml';

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const file = formData.get('image') as File;
  
  if (!file || file.size === 0) {
    return { error: 'Please select an image file' };
  }

  // Check if it's an image
  if (!file.type.startsWith('image/')) {
    return { error: 'File must be an image' };
  }

  // Convert image to base64 for display
  const arrayBuffer = await file.arrayBuffer();
  const base64Image = Buffer.from(arrayBuffer).toString('base64');
  const imageDataUrl = `data:${file.type};base64,${base64Image}`;

  // Analyze the image with OpenAI
  const result = await analyzeImageWithOpenAI(file);
  
  if (result.error) {
    return { error: result.error };
  }

  // Generate PlantUML diagram URL
  const plantUmlImageUrl = result.plantUmlText 
    ? generatePlantUmlImageUrl(result.plantUmlText)
    : '';
  
  return { 
    success: true, 
    fileName: file.name,
    fileSize: file.size,
    fileType: file.type,
    imageDataUrl,
    plantUmlText: result.plantUmlText,
    plantUmlImageUrl
  };
}

export default function PlantUmlImage() {
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const [selectedFile, setSelectedFile] = React.useState<string | null>(null);
  const [activeStep, setActiveStep] = React.useState(0);

  const isSubmitting = navigation.state === 'submitting';
  const isLoading = navigation.state === 'loading';

  const steps = [
    'Select Image',
    'Upload & Process',
    'AI Analysis',
    'Generate Diagram'
  ];

  React.useEffect(() => {
    if (isSubmitting) {
      setActiveStep(1);
      const timer1 = setTimeout(() => setActiveStep(2), 500);
      const timer2 = setTimeout(() => setActiveStep(3), 2000);
      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
    } else if (actionData?.success) {
      setActiveStep(4);
    } else if (!selectedFile) {
      setActiveStep(0);
    }
  }, [isSubmitting, actionData, selectedFile]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file.name);
      setActiveStep(1);
    }
  };

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
          PlantUML Image Upload
        </Typography>

        <Box sx={{ width: '100%', maxWidth: 600, mb: 4 }}>
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>

        <Form method="post" encType="multipart/form-data">
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, my: 3, minWidth: 300 }}>
            <Button
              variant="contained"
              component="label"
              disabled={isSubmitting}
            >
              Select Image
              <input
                type="file"
                name="image"
                accept="image/*"
                hidden
                onChange={handleFileChange}
              />
            </Button>
            
            {selectedFile && (
              <Alert severity="info" sx={{ alignItems: 'center' }}>
                Selected: {selectedFile}
              </Alert>
            )}

            <Button 
              type="submit" 
              variant="contained" 
              color="primary"
              disabled={!selectedFile || isSubmitting}
              startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : null}
            >
              {isSubmitting ? 'Processing...' : 'Upload and Analyze'}
            </Button>
          </Box>
        </Form>

        {isSubmitting && (
          <Box sx={{ width: '100%', maxWidth: 600, mt: 2 }}>
            <LinearProgress />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1, textAlign: 'center' }}>
              {activeStep === 1 && 'Uploading image...'}
              {activeStep === 2 && 'Analyzing with AI...'}
              {activeStep === 3 && 'Generating PlantUML diagram...'}
            </Typography>
          </Box>
        )}

        {actionData?.error && (
          <Alert severity="error" sx={{ mt: 2, maxWidth: 600 }}>
            {actionData.error}
          </Alert>
        )}

        {actionData?.success && (
          <Box sx={{ mt: 2, p: 3, bgcolor: 'success.light', borderRadius: 2, width: '100%', maxWidth: 800 }}>
            <Alert severity="success" sx={{ mb: 2 }}>
              Image analyzed successfully!
            </Alert>
            <Typography variant="body2">File name: {actionData.fileName}</Typography>
            <Typography variant="body2">File size: {(actionData.fileSize / 1024).toFixed(2)} KB</Typography>
            <Typography variant="body2">File type: {actionData.fileType}</Typography>
            
            {actionData.imageDataUrl && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Uploaded Image:
                </Typography>
                <Box
                  component="img"
                  src={actionData.imageDataUrl}
                  alt={actionData.fileName}
                  sx={{
                    maxWidth: '100%',
                    height: 'auto',
                    borderRadius: 1,
                    border: '1px solid',
                    borderColor: 'divider'
                  }}
                />
              </Box>
            )}

            {actionData.plantUmlText && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Generated PlantUML Code:
                </Typography>
                <Box 
                  component="pre" 
                  sx={{ 
                    bgcolor: 'background.paper', 
                    p: 2, 
                    borderRadius: 1, 
                    overflow: 'auto',
                    fontSize: '0.875rem'
                  }}
                >
                  {actionData.plantUmlText}
                </Box>
              </Box>
            )}

            {actionData.plantUmlImageUrl && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="h6" gutterBottom>
                  PlantUML Diagram:
                </Typography>
                <Box
                  component="img"
                  src={actionData.plantUmlImageUrl}
                  alt="PlantUML Diagram"
                  sx={{
                    maxWidth: '100%',
                    height: 'auto',
                    borderRadius: 1,
                    border: '1px solid',
                    borderColor: 'divider',
                    bgcolor: 'background.paper'
                  }}
                />
              </Box>
            )}
          </Box>
        )}

        <Box sx={{ mt: 3 }}>
          <Link to="/" color="secondary" component={ReactRouterLink}>
            Go back home
          </Link>
        </Box>
      </Box>
    </Container>
  );
}
