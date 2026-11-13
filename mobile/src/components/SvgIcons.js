import React from 'react';
import Svg, { Path, Rect, Circle, Polygon, Line } from 'react-native-svg';

export const ShieldIcon = ({ size = 24, color = '#FFFFFF', ...props }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter" {...props}>
    <Path d="M12 2L3 7V12C3 17.5 7 21.5 12 22C17 21.5 21 17.5 21 12V7L12 2Z" />
    <Path d="M12 7V17" />
  </Svg>
);

export const MapPinIcon = ({ size = 24, color = '#FFFFFF', ...props }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter" {...props}>
    <Path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2Z" />
    <Circle cx="12" cy="9" r="3" />
  </Svg>
);

export const RouteIcon = ({ size = 24, color = '#FFFFFF', ...props }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter" {...props}>
    <Circle cx="6" cy="19" r="3" />
    <Path d="M9 19H15C17.2 19 19 17.2 19 15V9C19 6.8 17.2 5 15 5H9" />
    <Circle cx="6" cy="5" r="3" />
    <Path d="M15 15L19 19L23 15" />
  </Svg>
);

export const AlertTriangleIcon = ({ size = 24, color = '#FFFFFF', ...props }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter" {...props}>
    <Polygon points="12,2 23,21 1,21" />
    <Line x1="12" y1="8" x2="12" y2="13" />
    <Circle cx="12" cy="17" r="1" fill={color} />
  </Svg>
);

export const HomeIcon = ({ size = 24, color = '#FFFFFF', ...props }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter" {...props}>
    <Path d="M3 10L12 3L21 10V21H3V10Z" />
    <Rect x="9" y="14" width="6" height="7" />
  </Svg>
);

export const SettingsIcon = ({ size = 24, color = '#FFFFFF', ...props }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter" {...props}>
    <Circle cx="12" cy="12" r="3" />
    <Path d="M19.4 15A1.65 1.65 0 0 0 20 16.27L20.8 17.65L19 19L17.65 18.2A1.65 1.65 0 0 0 16.4 18.7L16 20.3H14L13.6 18.7A1.65 1.65 0 0 0 12.35 18.2L11 19L9.2 17.65L10 16.27A1.65 1.65 0 0 0 9.6 15L8 14.6V12.6L9.6 12.2A1.65 1.65 0 0 0 10 10.93L9.2 9.55L11 8.2L12.35 9A1.65 1.65 0 0 0 13.6 8.5L14 6.9H16L16.4 8.5A1.65 1.65 0 0 0 17.65 9L19 8.2L20.8 9.55L20 10.93A1.65 1.65 0 0 0 19.4 12.2L21 12.6V14.6L19.4 15Z" />
  </Svg>
);

export const UsersIcon = ({ size = 24, color = '#FFFFFF', ...props }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter" {...props}>
    <Path d="M17 21V19C17 16.79 15.21 15 13 15H5C2.79 15 1 16.79 1 19V21" />
    <Circle cx="9" cy="7" r="4" />
    <Path d="M23 21V19C22.99 17.18 21.7 15.61 20 15.13" />
    <Path d="M16 3.13C17.72 3.6 19 5.16 19 7C19 8.84 17.72 10.4 16 10.87" />
  </Svg>
);

export const UserIcon = ({ size = 24, color = '#FFFFFF', ...props }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter" {...props}>
    <Path d="M20 21V19C20 16.79 18.21 15 16 15H8C5.79 15 4 16.79 4 19V21" />
    <Circle cx="12" cy="7" r="4" />
  </Svg>
);

export const CompassIcon = ({ size = 24, color = '#FFFFFF', ...props }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter" {...props}>
    <Circle cx="12" cy="12" r="10" />
    <Polygon points="16,8 14,14 8,16 10,10" fill={color} />
  </Svg>
);

export const BellIcon = ({ size = 24, color = '#FFFFFF', ...props }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter" {...props}>
    <Path d="M18 8C18 4.69 15.31 2 12 2C8.69 2 6 4.69 6 8C6 15 3 17 3 17H21C21 17 18 15 18 8Z" />
    <Path d="M13.73 21C13.55 21.3 13.3 21.56 13 21.73C12.7 21.9 12.35 22 12 22C11.65 22 11.3 21.9 11 21.73C10.7 21.56 10.45 21.3 10.27 21" />
  </Svg>
);

export const LockIcon = ({ size = 24, color = '#FFFFFF', ...props }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter" {...props}>
    <Rect x="3" y="11" width="18" height="11" rx="0" />
    <Path d="M7 11V7C7 4.24 9.24 2 12 2C14.76 2 17 4.24 17 7V11" />
  </Svg>
);

export const ChevronRightIcon = ({ size = 24, color = '#FFFFFF', ...props }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter" {...props}>
    <Path d="M9 18L15 12L9 6" />
  </Svg>
);

export const ChevronDownIcon = ({ size = 24, color = '#FFFFFF', ...props }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter" {...props}>
    <Path d="M6 9L12 15L18 9" />
  </Svg>
);

export const ArrowRightIcon = ({ size = 24, color = '#FFFFFF', ...props }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter" {...props}>
    <Line x1="5" y1="12" x2="19" y2="12" />
    <Path d="M12 5L19 12L12 19" />
  </Svg>
);

export const CheckIcon = ({ size = 24, color = '#FFFFFF', ...props }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="square" strokeLinejoin="miter" {...props}>
    <Path d="M20 6L9 17L4 12" />
  </Svg>
);

export const CrossIcon = ({ size = 24, color = '#FFFFFF', ...props }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter" {...props}>
    <Line x1="18" y1="6" x2="6" y2="18" />
    <Line x1="6" y1="6" x2="18" y2="18" />
  </Svg>
);

export const LogoutIcon = ({ size = 24, color = '#FFFFFF', ...props }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter" {...props}>
    <Path d="M9 21H5C3.9 21 3 20.1 3 19V5C3 3.9 3.9 3 5 3H9" />
    <Path d="M16 17L21 12L16 7" />
    <Line x1="21" y1="12" x2="9" y2="12" />
  </Svg>
);

export const PhoneIcon = ({ size = 24, color = '#FFFFFF', ...props }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter" {...props}>
    <Path d="M22 16.92V19.92C22 20.48 21.54 20.95 20.98 20.92C10.5 20.44 2.56 12.5 2.08 2.02C2.05 1.46 2.52 1 3.08 1H6.08C6.6 1 7.03 1.39 7.07 1.91C7.15 2.94 7.37 3.95 7.72 4.9C7.87 5.3 7.77 5.75 7.45 6.07L5.7 7.82C7.3 11 9.9 13.6 13.08 15.2L14.83 13.45C15.15 13.13 15.6 13.03 16 13.18C16.95 13.53 17.96 13.75 18.99 13.83C19.51 13.87 19.9 14.3 19.9 14.82V16.92H22Z" />
  </Svg>
);

export const MailIcon = ({ size = 24, color = '#FFFFFF', ...props }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter" {...props}>
    <Rect x="2" y="4" width="20" height="16" />
    <Path d="M2 6L12 13L22 6" />
  </Svg>
);

export const Cube3DIcon = ({ size = 24, color = '#FFFFFF', ...props }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.75" strokeLinecap="square" strokeLinejoin="miter" {...props}>
    <Polygon points="12,2 22,8 22,18 12,24 2,18 2,8" />
    <Line x1="12" y1="2" x2="12" y2="24" />
    <Line x1="12" y1="13" x2="22" y2="8" />
    <Line x1="12" y1="13" x2="2" y2="8" />
  </Svg>
);

export const GeometricDiamond = ({ size = 24, color = '#FFE600', ...props }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter" {...props}>
    <Polygon points="12,2 22,12 12,22 2,12" />
    <Rect x="8" y="8" width="8" height="8" stroke={color} strokeWidth="1" />
  </Svg>
);

export const StarIcon = ({ size = 16, color = '#FFE600', fill = '#FFE600', ...props }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={color} strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="miter" {...props}>
    <Polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
  </Svg>
);
