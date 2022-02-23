import Svg, {
  Circle,
  Ellipse,
  G,
  Text,
  TSpan,
  TextPath,
  Path,
  Polygon,
  Polyline,
  Line,
  Rect,
  Use,
  Image,
  Symbol,
  Defs,
  LinearGradient,
  RadialGradient,
  Stop,
  ClipPath,
  Pattern,
  Mask,
} from 'react-native-svg';

import React from 'react';
import { View, StyleSheet } from 'react-native';

export const clientLogo = props => (
  <Svg fill="none" {...props}>
     <defs>
      <style>{'.prefix__b{fill:#f47920}.prefix__d{fill:#003660}'}</style>
    </defs>
    <title>{'client Stores Logo'}</title>
    <path
      fill="#ffdf00"
      d="M200.2 0L90.54 109.64h72.55l29.52-29.51v29.52h51.28V0H200.2z"
    />
    <path
      className="prefix__b"
      d="M43.69 229.48l109.66-109.65H80.81l-29.53 29.52v-29.52H0v109.65h43.69z"
    />
    <path
      fill="#00aeef"
      d="M129.18 158.47l71.02 71.01h43.69V119.83h-51.28v29.52l-27.16-27.15-36.27 36.27z"
    />
    <path
      className="prefix__d"
      d="M114.72 71.01l-71-71H0v109.64h51.28V80.11l27.16 27.15zM644.48 21.19l20 34.51 20.42-34.51h24.51l-34.69 55.16v33.3h-21.19V76.11L619.7 21.19zm-46.28 35.3l-12.3-2.66c-6.26-1.33-10.26-4.26-10.26-8.8 0-4.79 5.86-7.19 13.72-7.19 9.33 0 16 3.87 18 10.26l21-3.07c-3.86-17.32-20-25.31-37.83-25.31-16.66 0-36.77 7.86-36.77 26.38 0 16.39 13.32 22.92 27.31 26l10.92 2.4c8.79 1.87 16.38 4.53 16.38 10.26 0 6.27-7.59 8.4-14.91 8.4-11.32 0-18.66-4.67-21-13.6l-16.16 2.36v.44a29.24 29.24 0 01-1.57 9.6c6.38 12.28 19.47 19.31 38.62 19.31 17.46 0 37-9.32 37-28.91.09-18.25-18.29-22.93-32.15-25.87zm-271.16 53.16l-19.58-70.47v70.47h-21.18V21.19h34.62l16.4 61.15 16-61.15h34.24v88.46h-21.19V39.04l-19.45 70.61zm96.55-88.46h23.18l34 88.46h-23l-5.59-16H417.9l-5.58 16h-22.57zm.8 54h21.18L435.05 44.9zm89-55.43c17.86 0 34 8 37.84 25.31l-21 3.07c-2-6.39-8.67-10.26-18-10.26-7.87 0-13.72 2.4-13.72 7.19 0 4.54 4 7.47 10.26 8.8l12.13 2.62c13.86 2.94 32.24 7.6 32.24 25.85 0 19.59-19.58 28.91-37 28.91-23.58 0-38-10.66-42-28.64l21.05-3.07c2.4 8.93 9.73 13.6 21.05 13.6 7.32 0 14.93-2.13 14.93-8.4 0-5.73-7.61-8.39-16.4-10.26l-10.87-2.37c-14-3.06-27.31-9.59-27.31-26-.02-18.53 20.1-26.39 36.75-26.39z"
    />
    <path
      className="prefix__b"
      d="M323.04 118.35c17.84 0 34 8 37.83 25.31l-21.05 3.07c-2-6.4-8.66-10.26-18-10.26-7.86 0-13.71 2.4-13.71 7.19 0 4.54 4 7.46 10.25 8.79l12.27 2.66c13.85 2.93 32.23 7.59 32.23 25.84 0 19.58-19.58 28.91-37 28.91-23.58 0-38-10.66-42-28.64l21-3.06c2.4 8.92 9.72 13.58 21 13.58 7.33 0 14.92-2.13 14.92-8.39 0-5.73-7.59-8.39-16.38-10.26l-10.92-2.4c-14-3.06-27.31-9.59-27.31-26 .1-18.48 20.21-26.34 36.87-26.34zm67 20.12h-28.8v-18.65h78.86v18.65h-28.91v69.8h-21.18zm92.13 71.4c-27.57 0-46.49-17.72-46.49-46.09s18.92-45.43 46.49-45.43 46.62 16.92 46.62 45.43-19.08 46.09-46.65 46.09zm0-73.66c-13.06 0-24.11 8.65-24.11 27.57s11.05 28.24 24.11 28.24 24.24-9.33 24.24-28.24-11.08-27.57-24.27-27.57zm84.59 39.56H553.4v32.5h-21.18v-88.45h33.17c23.31 0 40.76 5.46 40.76 27.71 0 13.32-7.19 20.78-17.45 24.64l22 36.1h-24.8zm-13.33-37.3v18.64h12.66c10 0 17.71-.94 17.71-9.33s-7.72-9.32-17.71-9.32zm59.55-18.65h68.86v18.65h-47.71v15h45v18.65h-45v17.45h47.68v18.65h-68.86zm107.89-1.47c17.85 0 34 8 37.83 25.31l-21 3.07c-2-6.4-8.65-10.26-18-10.26-7.86 0-13.72 2.4-13.72 7.19 0 4.54 4 7.46 10.26 8.79l12.19 2.66c13.86 2.93 32.24 7.59 32.24 25.84 0 19.58-19.58 28.91-37 28.91-23.58 0-38-10.66-42-28.64l21.05-3.06c2.4 8.92 9.72 13.58 21 13.58 7.33 0 14.92-2.13 14.92-8.39 0-5.73-7.59-8.39-16.38-10.26l-10.93-2.4c-14-3.06-27.3-9.59-27.3-26 .05-18.48 20.16-26.34 36.81-26.34z"
    />
  </Svg>
)

