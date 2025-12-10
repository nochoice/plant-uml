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
  const [selectedFile, setSelectedFile] = React.useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file.name);
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

        <Form method="post" encType="multipart/form-data">
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, my: 3 }}>
            <Button
              variant="contained"
              component="label"
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
              <Typography variant="body2" color="text.secondary">
                Selected: {selectedFile}
              </Typography>
            )}

            <Button 
              type="submit" 
              variant="contained" 
              color="primary"
              disabled={!selectedFile}
            >
              Upload and Check
            </Button>
          </Box>
        </Form>

        {actionData?.error && (
          <Typography color="error" sx={{ mt: 2 }}>
            {actionData.error}
          </Typography>
        )}

        {actionData?.success && (
          <Box sx={{ mt: 2, p: 2, bgcolor: 'success.light', borderRadius: 1, width: '100%', maxWidth: 800 }}>
            <Typography variant="h6" gutterBottom>
              Image analyzed successfully!
            </Typography>
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
