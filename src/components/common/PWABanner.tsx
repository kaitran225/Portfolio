import React, { useState, useEffect } from 'react';
import {
  Snackbar,
  Alert,
  Button,
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  CircularProgress
} from '@mui/material';
import {
  Download as DownloadIcon,
  Update as UpdateIcon,
  Close as CloseIcon,
  Wifi as WifiIcon,
  WifiOff as WifiOffIcon,
  Storage as StorageIcon,
  CloudOff as CloudOffIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';
import { usePWA } from '../../shared/services/pwaService';

interface PWABannerProps {
  position?: 'top' | 'bottom';
  autoHide?: boolean;
  showCacheInfo?: boolean;
}

const PWABanner: React.FC<PWABannerProps> = ({
  position = 'bottom',
  autoHide = false,
  showCacheInfo = true
}) => {
  const {
    isInstallable,
    hasUpdate,
    isOfflineReady,
    connectionStatus,
    installApp,
    updateApp,
    getCacheInfo,
    clearCache,
    getInstallationStatus
  } = usePWA();

  const [showInstallBanner, setShowInstallBanner] = useState(false);
  const [showUpdateBanner, setShowUpdateBanner] = useState(false);
  const [showOfflineBanner, setShowOfflineBanner] = useState(false);
  const [showConnectionBanner, setShowConnectionBanner] = useState(false);
  const [showCacheDialog, setShowCacheDialog] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isClearingCache, setIsClearingCache] = useState(false);
  const [cacheInfo, setCacheInfo] = useState({
    cacheSize: 0,
    cacheCount: 0,
    isOfflineReady: false
  });

  const installationStatus = getInstallationStatus();

  useEffect(() => {
    if (isInstallable && !installationStatus.isInstalled) {
      setShowInstallBanner(true);
      if (autoHide) {
        setTimeout(() => setShowInstallBanner(false), 10000);
      }
    }
  }, [isInstallable, installationStatus.isInstalled, autoHide]);

  useEffect(() => {
    if (hasUpdate) {
      setShowUpdateBanner(true);
    }
  }, [hasUpdate]);

  useEffect(() => {
    if (isOfflineReady) {
      setShowOfflineBanner(true);
      if (autoHide) {
        setTimeout(() => setShowOfflineBanner(false), 5000);
      }
    }
  }, [isOfflineReady, autoHide]);

  useEffect(() => {
    if (connectionStatus === 'offline') {
      setShowConnectionBanner(true);
    } else {
      setShowConnectionBanner(false);
    }
  }, [connectionStatus]);

  const handleInstallClick = async () => {
    setIsInstalling(true);
    try {
      const success = await installApp();
      if (success) {
        setShowInstallBanner(false);
      }
    } catch (error) {
      console.error('Installation failed:', error);
    } finally {
      setIsInstalling(false);
    }
  };

  const handleUpdateClick = async () => {
    setIsUpdating(true);
    try {
      await updateApp();
      setShowUpdateBanner(false);
    } catch (error) {
      console.error('Update failed:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCacheInfoClick = async () => {
    const info = await getCacheInfo();
    setCacheInfo(info);
    setShowCacheDialog(true);
  };

  const handleClearCache = async () => {
    setIsClearingCache(true);
    try {
      await clearCache();
      const info = await getCacheInfo();
      setCacheInfo(info);
    } catch (error) {
      console.error('Failed to clear cache:', error);
    } finally {
      setIsClearingCache(false);
    }
  };

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const bannerPosition = position === 'top' ? { top: 16 } : { bottom: 16 };

  return (
    <>
      {/* Install App Banner */}
      <Snackbar
        open={showInstallBanner}
        anchorOrigin={{ vertical: position, horizontal: 'center' }}
        sx={{ ...bannerPosition }}
      >
        <Alert
          severity="info"
          action={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Button
                color="inherit"
                size="small"
                onClick={handleInstallClick}
                disabled={isInstalling}
                startIcon={isInstalling ? <CircularProgress size={16} /> : <DownloadIcon />}
              >
                {isInstalling ? 'Installing...' : 'Install'}
              </Button>
              <IconButton
                size="small"
                onClick={() => setShowInstallBanner(false)}
                color="inherit"
              >
                <CloseIcon />
              </IconButton>
            </Box>
          }
        >
          Install this app for a better experience!
        </Alert>
      </Snackbar>

      {/* Update Available Banner */}
      <Snackbar
        open={showUpdateBanner}
        anchorOrigin={{ vertical: position, horizontal: 'center' }}
        sx={{ ...bannerPosition }}
      >
        <Alert
          severity="warning"
          action={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Button
                color="inherit"
                size="small"
                onClick={handleUpdateClick}
                disabled={isUpdating}
                startIcon={isUpdating ? <CircularProgress size={16} /> : <UpdateIcon />}
              >
                {isUpdating ? 'Updating...' : 'Update'}
              </Button>
              <IconButton
                size="small"
                onClick={() => setShowUpdateBanner(false)}
                color="inherit"
              >
                <CloseIcon />
              </IconButton>
            </Box>
          }
        >
          New version available! Update now for the latest features.
        </Alert>
      </Snackbar>

      {/* Offline Ready Banner */}
      <Snackbar
        open={showOfflineBanner}
        anchorOrigin={{ vertical: position, horizontal: 'center' }}
        sx={{ ...bannerPosition }}
        autoHideDuration={autoHide ? 5000 : null}
        onClose={() => setShowOfflineBanner(false)}
      >
        <Alert
          severity="success"
          action={
            showCacheInfo && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Button
                  color="inherit"
                  size="small"
                  onClick={handleCacheInfoClick}
                  startIcon={<StorageIcon />}
                >
                  Cache Info
                </Button>
                <IconButton
                  size="small"
                  onClick={() => setShowOfflineBanner(false)}
                  color="inherit"
                >
                  <CloseIcon />
                </IconButton>
              </Box>
            )
          }
        >
          App cached and ready for offline use!
        </Alert>
      </Snackbar>

      {/* Connection Status Banner */}
      <Snackbar
        open={showConnectionBanner}
        anchorOrigin={{ vertical: position, horizontal: 'center' }}
        sx={{ ...bannerPosition }}
      >
        <Alert
          severity={connectionStatus === 'offline' ? 'warning' : 'success'}
          icon={connectionStatus === 'offline' ? <WifiOffIcon /> : <WifiIcon />}
        >
          {connectionStatus === 'offline' 
            ? 'You are offline. Some features may be limited.'
            : 'Back online! All features are available.'
          }
        </Alert>
      </Snackbar>

      {/* Cache Info Dialog */}
      <Dialog
        open={showCacheDialog}
        onClose={() => setShowCacheDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <StorageIcon />
            Cache Information
          </Box>
        </DialogTitle>
        <DialogContent>
          <List>
            <ListItem>
              <ListItemText
                primary="Cache Size"
                secondary={formatBytes(cacheInfo.cacheSize)}
              />
              <Chip
                icon={<CheckCircleIcon />}
                label={cacheInfo.cacheSize > 0 ? 'Active' : 'Empty'}
                color={cacheInfo.cacheSize > 0 ? 'success' : 'default'}
                size="small"
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Cache Count"
                secondary={`${cacheInfo.cacheCount} cache storage(s)`}
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Offline Ready"
                secondary={cacheInfo.isOfflineReady ? 'Yes' : 'No'}
              />
              <Chip
                icon={cacheInfo.isOfflineReady ? <CheckCircleIcon /> : <CloudOffIcon />}
                label={cacheInfo.isOfflineReady ? 'Ready' : 'Not Ready'}
                color={cacheInfo.isOfflineReady ? 'success' : 'warning'}
                size="small"
              />
            </ListItem>
          </List>
          
          {cacheInfo.cacheSize > 0 && (
            <Card sx={{ mt: 2, bgcolor: 'background.paper' }}>
              <CardContent>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Clear cache to free up storage space. This will require re-downloading 
                  content when you next visit.
                </Typography>
                <Button
                  variant="outlined"
                  color="warning"
                  onClick={handleClearCache}
                  disabled={isClearingCache}
                  startIcon={isClearingCache ? <CircularProgress size={16} /> : <StorageIcon />}
                  fullWidth
                >
                  {isClearingCache ? 'Clearing...' : 'Clear Cache'}
                </Button>
              </CardContent>
            </Card>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowCacheDialog(false)}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default PWABanner;
