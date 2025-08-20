import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardActions,
  Typography,
  TextField,
  Container,
  Chip,
  IconButton,
  Tooltip,
  Alert,
  Snackbar,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Favorite,
  Star,
  Settings,
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  CheckCircle,
  Info,
  Warning,
} from '@mui/icons-material';

export const MUIDemo: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [showPassword, setShowPassword] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [severity, setSeverity] = useState<'success' | 'info' | 'warning' | 'error'>('success');

  const handlePasswordToggle = () => setShowPassword(!showPassword);

  const showSnackbar = (message: string, type: 'success' | 'info' | 'warning' | 'error' = 'success') => {
    setSnackbarMessage(message);
    setSeverity(type);
    setSnackbarOpen(true);
  };

  const handleCloseSnackbar = () => setSnackbarOpen(false);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header Section */}
      <Box textAlign="center" mb={6}>
        <Typography variant="h2" component="h1" gutterBottom color="primary">
          Material-UI Demo
        </Typography>
        <Typography variant="h5" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
          Modern React components following Material Design principles with custom theming and responsive design
        </Typography>
      </Box>

      {/* Buttons Section */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h4" gutterBottom>
            Buttons
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Different button variants and sizes with custom styling
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
            <Button variant="contained" color="primary">
              Primary
            </Button>
            <Button variant="contained" color="secondary">
              Secondary
            </Button>
            <Button variant="outlined" color="primary">
              Outlined
            </Button>
            <Button variant="text" color="primary">
              Text
            </Button>
            <Button variant="contained" color="success">
              Success
            </Button>
            <Button variant="contained" color="error">
              Error
            </Button>
          </Box>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            <Button size="small" variant="contained">
              Small
            </Button>
            <Button size="medium" variant="contained">
              Medium
            </Button>
            <Button size="large" variant="contained">
              Large
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Form Section */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h4" gutterBottom>
            Form Elements
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Interactive form components with validation and modern styling
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, maxWidth: 500 }}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              placeholder="Enter your email"
              InputProps={{
                startAdornment: <Email sx={{ mr: 1, color: 'text.secondary' }} />,
              }}
            />
            <TextField
              fullWidth
              label="Password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
              InputProps={{
                startAdornment: <Lock sx={{ mr: 1, color: 'text.secondary' }} />,
                endAdornment: (
                  <IconButton onClick={handlePasswordToggle} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                ),
              }}
            />
            <Button
              fullWidth
              variant="contained"
              size="large"
              onClick={() => showSnackbar('Form submitted successfully!', 'success')}
            >
              Submit
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Cards Grid Section */}
      <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
        Feature Cards
      </Typography>
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' },
        gap: 3, 
        mb: 4 
      }}>
        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          <CardContent sx={{ flexGrow: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" component="h3" sx={{ flexGrow: 1 }}>
                Feature 1
              </Typography>
              <Tooltip title="Favorite">
                <IconButton size="small" color="primary">
                  <Star />
                </IconButton>
              </Tooltip>
            </Box>
            <Typography variant="body2" color="text.secondary" paragraph>
              Description of the first feature with comprehensive details and examples.
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Chip label="New" color="primary" size="small" />
              <Chip label="Popular" color="success" size="small" />
            </Box>
          </CardContent>
          <CardActions>
            <Button size="small" onClick={() => showSnackbar('Feature 1 selected!', 'info')}>
              Learn More
            </Button>
          </CardActions>
        </Card>

        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          <CardContent sx={{ flexGrow: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" component="h3" sx={{ flexGrow: 1 }}>
                Feature 2
              </Typography>
              <Tooltip title="Like">
                <IconButton size="small" color="secondary">
                  <Favorite />
                </IconButton>
              </Tooltip>
            </Box>
            <Typography variant="body2" color="text.secondary" paragraph>
              Another amazing feature with detailed description and benefits.
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Chip label="Hot" color="warning" size="small" />
              <Chip label="Featured" color="secondary" size="small" />
            </Box>
          </CardContent>
          <CardActions>
            <Button size="small" onClick={() => showSnackbar('Feature 2 selected!', 'info')}>
              Learn More
            </Button>
          </CardActions>
        </Card>

        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          <CardContent sx={{ flexGrow: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" component="h3" sx={{ flexGrow: 1 }}>
                Feature 3
              </Typography>
              <Tooltip title="Settings">
                <IconButton size="small" color="default">
                  <Settings />
                </IconButton>
              </Tooltip>
            </Box>
            <Typography variant="body2" color="text.secondary" paragraph>
              Third feature showcasing advanced capabilities and integration.
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Chip label="Stable" color="success" size="small" />
              <Chip label="Pro" color="info" size="small" />
            </Box>
          </CardContent>
          <CardActions>
            <Button size="small" onClick={() => showSnackbar('Feature 3 selected!', 'info')}>
              Learn More
            </Button>
          </CardActions>
        </Card>
      </Box>

      {/* Alerts Section */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h4" gutterBottom>
            Alerts & Notifications
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Different types of alerts and feedback components
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Alert severity="success" icon={<CheckCircle />}>
              This is a success alert — check it out!
            </Alert>
            <Alert severity="info" icon={<Info />}>
              This is an info alert — check it out!
            </Alert>
            <Alert severity="warning" icon={<Warning />}>
              This is a warning alert — check it out!
            </Alert>
            <Alert severity="error" icon={<Warning />}>
              This is an error alert — check it out!
            </Alert>
          </Box>
        </CardContent>
      </Card>

      {/* Responsive Design Demo */}
      <Card>
        <CardContent>
          <Typography variant="h4" gutterBottom>
            Responsive Design
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            This section adapts to different screen sizes
          </Typography>
          <Box sx={{ 
            p: 2, 
            bgcolor: isMobile ? 'warning.light' : 'success.light',
            borderRadius: 1,
            textAlign: 'center'
          }}>
            <Typography variant="body1">
              {isMobile 
                ? '📱 Mobile View - Optimized for small screens'
                : '🖥️ Desktop View - Full layout with enhanced spacing'
              }
            </Typography>
          </Box>
        </CardContent>
      </Card>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={severity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
}; 