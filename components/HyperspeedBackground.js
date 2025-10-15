import { useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { useTheme } from './ThemeContext';

// Dynamic import to prevent SSR issues
const Hyperspeed = dynamic(() => import('./Hyperspeed'), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-black" />
});

const HyperspeedBackground = () => {
  const { isDarkMode } = useTheme();
  
  const effectOptions = {
    onSpeedUp: () => {},
    onSlowDown: () => {},
    distortion: 'turbulentDistortion',
    length: 400,
    roadWidth: 10,
    islandWidth: 2,
    lanesPerRoad: 4,
    fov: 90,
    fovSpeedUp: 150,
    speedUp: 2,
    carLightsFade: 0.4,
    totalSideLightSticks: 20,
    lightPairsPerRoadWay: 40,
    shoulderLinesWidthPercentage: 0.05,
    brokenLinesWidthPercentage: 0.1,
    brokenLinesLengthPercentage: 0.5,
    lightStickWidth: [0.12, 0.5],
    lightStickHeight: [1.3, 1.7],
    movingAwaySpeed: [60, 80],
    movingCloserSpeed: [-120, -160],
    carLightsLength: [400 * 0.03, 400 * 0.2],
    carLightsRadius: [0.05, 0.14],
    carWidthPercentage: [0.3, 0.5],
    carShiftX: [-0.8, 0.8],
    carFloorSeparation: [0, 5],
    colors: {
      // Dynamic colors based on theme
      roadColor: isDarkMode ? 0x080808 : 0xf8f9fa,
      islandColor: isDarkMode ? 0x0a0a0a : 0xe9ecef,
      background: isDarkMode ? 0x000000 : 0xffffff,
      shoulderLines: isDarkMode ? 0xffffff : 0x000000,
      brokenLines: isDarkMode ? 0xffffff : 0x000000,
      leftCars: [0xd856bf, 0x6750a2, 0xc247ac],
      rightCars: [0x03b3c3, 0x0e5ea5, 0x324555],
      sticks: 0x03b3c3
    }
  };

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden">
      <Hyperspeed effectOptions={effectOptions} />
    </div>
  );
};

export default HyperspeedBackground;