// 'use client';

// import { createContext, useState, useEffect, useContext, useMemo, ReactNode } from 'react';
// import { PALETTES } from '@acme/core';
// import { updatePrimaryColor, updateSecondaryColor, updateTertiaryColor } from '@acme/utils';
// import { getCookie, setCookie } from 'cookies-next';
// import { useTheme } from 'next-themes';

// interface IPalettes {
//   PRIMARY: string;
//   SECONDARY: string;
//   TERTIARY: string;
// }

// interface ThemeContextData {
//   modeColor: string;
//   palettes: IPalettes;
//   setPrimaryColor: (color: string) => void;
//   setSecondaryColor: (color: string) => void;
//   setTertiaryColor: (color: string) => void;
//   skin: 'Default' | 'Bordered';
//   setSkin: (selectedSkin: 'Default' | 'Bordered') => void;
//   theme: string | undefined;
//   toggleTheme: (theme: string) => void;
// }

// const ThemeContext = createContext<ThemeContextData | null>(null);

// export const useThemeContext = () => {
//   const context = useContext(ThemeContext);
//   if (!context) {
//     throw new Error('useColor must be used within a ColorProvider');
//   }
//   return context;
// };

// const ColorProvider = ({ children }: { children: ReactNode }) => {
//   const { theme, setTheme } = useTheme();
//   const [palettes, setPalettes] = useState<IPalettes>(PALETTES); // Set the initial primary color here
//   const [skin, setSkinState] = useState<'Default' | 'Bordered'>('Default'); // Set the initial skin
//   const [modeColor, setModeColorState] = useState<string>('white'); // Set the initial skin
//   const [mounted, setMounted] = useState(false);

//   useEffect(() => {
//     // Load the selected color from localStorage when the component mounts
//     const storedModeColor = getCookie('modeColor');
//     const storedSkin = getCookie('skin');
//     if (storedModeColor) {
//       document.documentElement.style.setProperty('--mode-color', storedModeColor as string);
//       setModeColorState(storedModeColor as string);
//     }
//     const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
//     if (!storedModeColor && isDarkMode) {
//       document.documentElement.style.setProperty(
//         '--mode-color',
//         storedSkin === 'Default' ? '#232333' : '#2b2c40',
//       );
//     }
//     if (storedSkin) {
//       setSkinState(storedSkin as 'Default' | 'Bordered');
//     }

//     const primaryColor = getCookie('primaryColor');
//     if (primaryColor) {
//       updatePrimaryColor(primaryColor as string);
//       setPalettes({
//         ...palettes,
//         PRIMARY: primaryColor as string,
//       });
//     }

//     const secondaryColor = getCookie('secondaryColor');
//     if (secondaryColor) {
//       updateSecondaryColor(secondaryColor as string);
//       setPalettes({
//         ...palettes,
//         SECONDARY: secondaryColor as string,
//       });
//     }

//     const tertiaryColor = getCookie('tertiaryColor');
//     if (tertiaryColor) {
//       updateTertiaryColor(tertiaryColor as string);
//       setPalettes({
//         ...palettes,
//         TERTIARY: tertiaryColor as string,
//       });
//     }
//     setMounted(true);
//   }, []);

//   const setPrimaryColor = (color: string) => {
//     updatePrimaryColor(color);
//     setPalettes({
//       ...palettes,
//       PRIMARY: color,
//     });
//     // Save the selected color to localStorage
//     setCookie('primaryColor', color);
//   };

//   const setSecondaryColor = (color: string) => {
//     updateSecondaryColor(color);
//     setPalettes({
//       ...palettes,
//       SECONDARY: color,
//     });
//     // Save the selected color to localStorage
//     setCookie('secondaryColor', color);
//   };

//   const setTertiaryColor = (color: string) => {
//     updateTertiaryColor(color);
//     setPalettes({
//       ...palettes,
//       TERTIARY: color,
//     });
//     // Save the selected color to localStorage
//     setCookie('tertiaryColor', color);
//   };

//   const setSkin = (selectedSkin: 'Default' | 'Bordered') => {
//     setSkinState(selectedSkin);
//     if (theme === 'dark') {
//       document.documentElement.style.setProperty(
//         '--mode-color',
//         selectedSkin === 'Default' ? '#232333' : '#2b2c40',
//       );
//       setModeColorState(selectedSkin === 'Default' ? '#232333' : '#2b2c40');
//       setCookie('modeColor', selectedSkin === 'Default' ? '#232333' : '#2b2c40');
//     }
//     // Save the selected skin to localStorage
//     setCookie('skin', selectedSkin);
//   };

//   const toggleTheme = (selectedTheme: string) => {
//     setTheme(selectedTheme);
//     const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
//     if (selectedTheme === 'dark' || (selectedTheme === 'system' && isDarkMode)) {
//       document.documentElement.style.setProperty(
//         '--mode-color',
//         skin === 'Default' ? '#232333' : '#2b2c40',
//       );
//       setModeColorState(skin === 'Default' ? '#232333' : '#2b2c40');
//       setCookie('modeColor', skin === 'Default' ? '#232333' : '#2b2c40');
//     } else {
//       setModeColorState('white');
//       document.documentElement.style.setProperty('--mode-color', 'white');
//       setCookie('modeColor', 'white');
//     }
//   };

//   // Wrap the context value in useMemo to prevent unnecessary re-renders
//   const ThemeContextValue = useMemo(
//     () => ({
//       modeColor,
//       palettes,
//       setPrimaryColor,
//       setSecondaryColor,
//       setTertiaryColor,
//       skin,
//       setSkin,
//       theme,
//       toggleTheme,
//     }),
//     [palettes, skin, theme],
//   );
//   if (!mounted) return null;
//   return <ThemeContext.Provider value={ThemeContextValue}>{children}</ThemeContext.Provider>;
// };

// export default ColorProvider;
