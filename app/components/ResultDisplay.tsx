import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';

interface ResultDisplayProps {
  fileName: string;
  fileSize: number;
  fileType: string;
  imageDataUrl?: string;
  plantUmlText?: string;
  plantUmlImageUrl?: string;
  diagramType?: string;
}

export default function ResultDisplay({
  fileName,
  fileSize,
  fileType,
  imageDataUrl,
  plantUmlText,
  plantUmlImageUrl,
  diagramType = 'plantuml'
}: ResultDisplayProps) {
  const diagramLabel = diagramType === 'mermaid' ? 'Mermaid' : diagramType === 'zenuml' ? 'ZenUML' : 'PlantUML';
  return (
    <Box sx={{ mt: 2, p: 3, bgcolor: 'success.light', borderRadius: 2, width: '100%', maxWidth: 800 }}>
      <Alert severity="success" sx={{ mb: 2 }}>
        Image analyzed successfully!
      </Alert>
      <Typography variant="body2">File name: {fileName}</Typography>
      <Typography variant="body2">File size: {(fileSize / 1024).toFixed(2)} KB</Typography>
      <Typography variant="body2">File type: {fileType}</Typography>
      
      {imageDataUrl && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="h6" gutterBottom>
            Uploaded Image:
          </Typography>
          <Box
            component="img"
            src={imageDataUrl}
            alt={fileName}
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

      {plantUmlText && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="h6" gutterBottom>
            Generated {diagramLabel} Code:
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
            {plantUmlText}
          </Box>
        </Box>
      )}

      {plantUmlImageUrl && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="h6" gutterBottom>
            {diagramLabel} Diagram:
          </Typography>
          <Box
            component="img"
            src={plantUmlImageUrl}
            alt={`${diagramLabel} Diagram`}
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
  );
}
