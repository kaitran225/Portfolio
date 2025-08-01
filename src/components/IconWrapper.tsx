import React from 'react';
import * as FiIcons from 'react-icons/fi';

// ============= REACT ICONS WRAPPER FOR REACT 19 COMPATIBILITY =============

// Type definition for icon wrapper
interface IconWrapperProps {
  size?: number | string;
  color?: string;
  className?: string;
  style?: React.CSSProperties;
}

// Generic icon wrapper that ensures React 19 compatibility
const createIconWrapper = (IconComponent: any) => {
  return React.forwardRef<SVGSVGElement, IconWrapperProps>((props, ref) => {
    return React.createElement(IconComponent, { ...props, ref });
  });
};

// Export wrapped icons for React 19 compatibility
export const FiHome = createIconWrapper(FiIcons.FiHome);
export const FiUser = createIconWrapper(FiIcons.FiUser);
export const FiCode = createIconWrapper(FiIcons.FiCode);
export const FiBriefcase = createIconWrapper(FiIcons.FiBriefcase);
export const FiMail = createIconWrapper(FiIcons.FiMail);
export const FiMenu = createIconWrapper(FiIcons.FiMenu);
export const FiX = createIconWrapper(FiIcons.FiX);
export const FiSun = createIconWrapper(FiIcons.FiSun);
export const FiMoon = createIconWrapper(FiIcons.FiMoon);
export const FiGithub = createIconWrapper(FiIcons.FiGithub);
export const FiLinkedin = createIconWrapper(FiIcons.FiLinkedin);
export const FiTwitter = createIconWrapper(FiIcons.FiTwitter);
export const FiDownload = createIconWrapper(FiIcons.FiDownload);
export const FiSettings = createIconWrapper(FiIcons.FiSettings);
export const FiEye = createIconWrapper(FiIcons.FiEye);
export const FiEyeOff = createIconWrapper(FiIcons.FiEyeOff);
export const FiType = createIconWrapper(FiIcons.FiType);
export const FiZoomIn = createIconWrapper(FiIcons.FiZoomIn);
export const FiZoomOut = createIconWrapper(FiIcons.FiZoomOut);
export const FiMousePointer = createIconWrapper(FiIcons.FiMousePointer);
export const FiActivity = createIconWrapper(FiIcons.FiActivity);
export const FiVolume2 = createIconWrapper(FiIcons.FiVolume2);
export const FiStar = createIconWrapper(FiIcons.FiStar);
export const FiPlay = createIconWrapper(FiIcons.FiPlay);
export const FiExternalLink = createIconWrapper(FiIcons.FiExternalLink);
export const FiCheck = createIconWrapper(FiIcons.FiCheck);
export const FiSend = createIconWrapper(FiIcons.FiSend);
export const FiMessageSquare = createIconWrapper(FiIcons.FiMessageSquare);
export const FiCalendar = createIconWrapper(FiIcons.FiCalendar);
export const FiMapPin = createIconWrapper(FiIcons.FiMapPin);
export const FiClock = createIconWrapper(FiIcons.FiClock);
export const FiTrendingUp = createIconWrapper(FiIcons.FiTrendingUp);
export const FiLayers = createIconWrapper(FiIcons.FiLayers);
export const FiTool = createIconWrapper(FiIcons.FiTool);
export const FiDatabase = createIconWrapper(FiIcons.FiDatabase);
export const FiZap = createIconWrapper(FiIcons.FiZap);
export const FiMonitor = createIconWrapper(FiIcons.FiMonitor);
export const FiAlertCircle = createIconWrapper(FiIcons.FiAlertCircle);
export const FiAlertTriangle = createIconWrapper(FiIcons.FiAlertTriangle);
export const FiRefreshCw = createIconWrapper(FiIcons.FiRefreshCw);

// Create FiAlert as an alias for FiAlertCircle since it doesn't exist in react-icons/fi
export const FiAlert = createIconWrapper(FiIcons.FiAlertCircle);

// Export all icons as a single object for convenience
export const Icons = {
  FiHome,
  FiUser,
  FiCode,
  FiBriefcase,
  FiMail,
  FiMenu,
  FiX,
  FiSun,
  FiMoon,
  FiGithub,
  FiLinkedin,
  FiTwitter,
  FiDownload,
  FiSettings,
  FiEye,
  FiEyeOff,
  FiType,
  FiZoomIn,
  FiZoomOut,
  FiMousePointer,
  FiActivity,
  FiVolume2,
  FiStar,
  FiPlay,
  FiExternalLink,
  FiCheck,
  FiSend,
  FiAlert,
  FiMessageSquare,
  FiCalendar,
  FiMapPin,
  FiClock,
  FiTrendingUp,
  FiLayers,
  FiTool,
  FiDatabase,
  FiZap,
  FiMonitor,
  FiAlertCircle,
  FiAlertTriangle,
  FiRefreshCw,
};

export default Icons;
