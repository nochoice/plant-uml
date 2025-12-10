import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';

interface UploadFormProps {
  selectedFile: string | null;
  isSubmitting: boolean;
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function UploadForm({ selectedFile, isSubmitting, onFileChange }: UploadFormProps) {
  return (
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
          onChange={onFileChange}
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
  );
}
