import * as React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Alert from '@mui/material/Alert';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { Link as ReactRouterLink, Form, useActionData, useNavigation } from 'react-router';
import type { Route } from './+types/plant-uml-image';
import { analyzeImageWithOpenAI } from '~/domains/openAI';
import { analyzeImageForMermaid } from '~/domains/openAI/analyzeMermaid';
import { generatePlantUmlImageUrl } from '~/domains/plantUml';
import { generateMermaidImageUrl } from '~/domains/mermaid';
import ProcessStepper from '~/components/ProcessStepper';
import UploadForm from '~/components/UploadForm';
import LoadingIndicator from '~/components/LoadingIndicator';
import ResultDisplay from '~/components/ResultDisplay';

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const file = formData.get('image') as File;
  const diagramType = formData.get('diagramType') as string || 'plantuml';
  
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

  // Analyze the image based on selected diagram type
  let diagramText = '';
  let diagramImageUrl = '';
  let error = '';

  if (diagramType === 'mermaid') {
    const result = await analyzeImageForMermaid(file);
    if (result.error) {
      error = result.error;
    } else {
      diagramText = result.diagramText;
      diagramImageUrl = generateMermaidImageUrl(diagramText);
    }
  } else {
    const result = await analyzeImageWithOpenAI(file);
    if (result.error) {
      error = result.error;
    } else {
      diagramText = result.plantUmlText;
      diagramImageUrl = generatePlantUmlImageUrl(diagramText);
    }
  }
  
  if (error) {
    return { error };
  }
  
  return { 
    success: true, 
    fileName: file.name,
    fileSize: file.size,
    fileType: file.type,
    imageDataUrl,
    diagramText,
    diagramImageUrl,
    diagramType
  };
}

export default function PlantUmlImage() {
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const [selectedFile, setSelectedFile] = React.useState<string | null>(null);
  const [activeStep, setActiveStep] = React.useState(0);
  const [diagramType, setDiagramType] = React.useState<'plantuml' | 'mermaid'>('plantuml');

  const isSubmitting = navigation.state === 'submitting';

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
    <Container maxWidth="xl">
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
          Diagram Generator
        </Typography>

        <Box sx={{ mb: 3 }}>
          <ToggleButtonGroup
            value={diagramType}
            exclusive
            onChange={(_, newType) => newType && setDiagramType(newType)}
            aria-label="diagram type"
          >
            <ToggleButton value="plantuml" aria-label="plantuml">
              PlantUML
            </ToggleButton>
            <ToggleButton value="mermaid" aria-label="mermaid">
              Mermaid
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>

        <ProcessStepper activeStep={activeStep} />

        <Form method="post" encType="multipart/form-data">
          <input type="hidden" name="diagramType" value={diagramType} />
          <UploadForm
            selectedFile={selectedFile}
            isSubmitting={isSubmitting}
            onFileChange={handleFileChange}
          />
        </Form>

        {isSubmitting && <LoadingIndicator activeStep={activeStep} />}

        {actionData?.error && (
          <Alert severity="error" sx={{ mt: 2, maxWidth: 600 }}>
            {actionData.error}
          </Alert>
        )}

        {actionData?.success && (
          <ResultDisplay
            fileName={actionData.fileName}
            fileSize={actionData.fileSize}
            fileType={actionData.fileType}
            imageDataUrl={actionData.imageDataUrl}
            plantUmlText={actionData.diagramText}
            plantUmlImageUrl={actionData.diagramImageUrl}
            diagramType={actionData.diagramType}
          />
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
