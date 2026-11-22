// KiraKira Nihongo — Kana Writing Companion Data (Phase 1: All 46 Hiragana & 10 Row Lessons)
// Stroke data from KanjiVG by Ulrich Apel (https://kanjivg.tagaini.net/), used under CC BY-SA 3.0.

export const HIRAGANA_STROKES = {
  "あ": ["M31.01,33c0.88,0.88,2.75,1.82,5.25,1.75c8.62-0.25,20-2.12,29.5-4.25c1.51-0.34,4.62-0.88,6.62-0.5","M49.76,17.62c0.88,1,1.82,3.26,1.38,5.25c-3.75,16.75-6.25,38.13-5.13,53.63c0.41,5.7,1.88,10.88,3.38,13.62","M65.63,44.12c0.75,1.12,1.16,4.39,0.5,6.12c-4.62,12.26-11.24,23.76-25.37,35.76c-6.86,5.83-15.88,3.75-16.25-8.38c-0.34-10.87,13.38-23.12,32.38-26.74c12.42-2.37,27,1.38,30.5,12.75c4.05,13.18-3.76,26.37-20.88,30.49"],
  "い": ["M21.5,29.66c2.01,2.17,2.61,4.68,2.17,7.43c-3.09,19.16-1.03,32.01,7.93,41.45c6.12,6.45,6.26,3.14,7.04-5.21","M72.96,36.51c9.44,8.05,17.79,18.82,18.41,33.83"],
  "う": ["M42,15.5c5.62,2.12,9.62,3,12.88,3c8.27,0,8,1.12-0.38,5.5","M33,42.38c2.12,1.12,4.12,2.88,8.5,1.38c4.38-1.5,12.75-7.12,18.5-7c5.75,0.12,10.25,5,10.25,18c0,15.49-8.25,30.24-24.37,41.24"],
  "え": ["M40.52,13.25c5.62,2.12,10,3,14.12,3c8.27,0,8,1.12-0.38,5.5","M32.52,45.12c1.88,1.25,4.5,1.75,7.38,0.62c3.29-1.29,17-7.88,21.25-9.88c4.25-2,8.32,0.04,4.38,4.62c-12.26,14.27-27.26,31.52-39.51,44.4c-3.26,3.42-0.58,3.54,1.5,1.37c13.5-14.12,18.12-20.12,23.62-20.12c7.13,0,3.5,16.75,6.75,22.38c3.25,5.63,19.12,3.75,26.12,2.12"],
  "お": ["M22.88,35.12c1.38,1,3.62,2.38,6,2.12c2.38-0.26,19.62-5.12,21.12-5.74c1.5-0.62,4-1.25,5.88-2","M41.5,16.12c2.25,1,3.59,4.39,3.12,7.38c-2.5,16.12-3.37,45.53-2.25,58.38c0.75,8.62-0.64,10.45-7.12,7.12c-5.13-2.62-13.75-8-13.75-12.38c0-7.5,24.38-23.62,44.75-23.62c17.25,0,25,8.25,25,17.25c0,8.25-9.38,18.88-26.75,21","M73,22.12c5.38,2.62,8.88,5.88,10.62,8.25c2.27,3.08,0.38,4.5-1.12,5"],
  "か": ["M24.62,38.62c1.88,1.62,4.65,2.33,8.62,1c25.5-8.5,29.5-4.13,29.5,7.62c0,9.38-1.24,17.46-4.25,25.25c-7.62,19.76-10.87,17.39-16.12,10.89","M48.5,17.5c1,1.38,1.29,4.7,0.5,7.12c-5,15.25-18.02,40.93-19.62,43.88c-3.12,5.75-6.38,11.88-9.38,16.25","M77.37,31.62c7.5,6.88,13.25,15.75,15,24.88"],
  "き": ["M30.5,30.25c1.88,0.75,4.64,1.06,5.88,0.88c6.75-1,22.25-4.5,26.5-6c2.17-0.76,3.5-1.25,4.88-2.12","M36.25,48.7c2.01,0.85,4.97,1.2,6.29,0.99c7.23-1.13,23.82-5.09,28.37-6.79c2.32-0.86,3.75-1.41,5.22-2.4","M42,14.12c1.5,0.88,3.13,2.94,4,5.12c5.5,13.76,16,29.26,26.37,40.76c7.64,8.47,9.12,9.38-6,3.88","M33.75,83.25c10.62,9.75,27.25,8.62,38.12,5"],
  "く": ["M60.66,15c0.5,1.62,0.35,5.44-1,7.38c-6.75,9.62-14.3,19.08-18.62,24.5c-4,5-3.79,7.03-0.88,11c5.5,7.5,12.75,18.75,17.62,27.25c1.48,2.59,2.75,4.75,4.5,8.62"],
  "け": ["M24.67,19.75c1.25,1.5,2.62,3.75,2.12,6.38c-3,15.88-6.5,29.5-4.88,44.62c2.02,18.84,2.25,4.75,6.75-3.5","M53.67,38.62c2.12,1.38,4.28,1.89,6.88,1.5c8.25-1.25,15.39-2.57,20.62-4c2.76-0.74,5.26-1.12,6.88-1.12","M71.67,14.38c2.13,1.37,2.88,3.35,2.88,5.12c0,11.62,0.12,20.38,0.12,30.12c0,20.75-0.62,30.88-12.5,42.25"],
  "こ": ["M34.75,26.75c1.12,0.88,2.91,2.01,6,1.5c7.62-1.25,14.11-2.56,22.38-2.62c15.5-0.12,5.88,5-5.75,9","M30,68.12c2.25,14.5,15.26,17.96,31,16.75c6.5-0.5,11.88-1.25,17.62-2.88"],
  "さ": ["M27,38.9c2.42,1.33,5.38,1.47,8.32,1.06c8.79-1.24,28.67-7.76,34.15-10.43c2.79-1.36,3.78-1.91,6.28-3.53","M41.5,13.88c1.5,0.88,3.63,2.94,4.5,5.12c5.5,13.75,15.25,27.62,26.87,39.5c7.98,8.15,6.38,10-6,3.12","M35.25,80.5c4.5,11.75,20.88,12.5,38.38,7.5"],
  "し": ["M39.12,17.5c1.25,3.12,0.93,6.74,0.38,10.25c-2.12,13.5-3,26.5-3,39.12c0,27.38,19.88,30.12,45.5,17.25"],
  "す": ["M15.5,37.12c2.88,2.12,6.94,1.51,12.75,0.25c16.12-3.5,36.14-5.38,46.62-6.5c7-0.75,11.88-0.62,17.75,0.12","M57.62,13.38c2,1.5,2.75,3.25,2.75,5.88c0,10.38,0,35.12,0,40.75c0,14.62-15.62,16.38-15.62,1.75c0-14.25,18-14.12,18,6.38c0,13.25-7.75,21.5-16,28.38"],
  "せ": ["M16.5,49.93c2.88,2.42,6.86,1.57,12.75,0.53c19-3.34,33-5.72,47.12-7.64c6.99-0.95,11.88-1.21,17.75-0.36","M69.74,17.75c2,1.5,2.75,3.25,2.75,5.88c0,10.38,0,17.88,0,23.5c0,25.62-5.75,23.25-11.88,19","M35.62,26.25c2,1.5,2.75,3.25,2.75,5.88c0,10.38,0,28.38,0,34c0,14.5,6.38,19.55,20.14,19.55c10.24,0,13.74,0.07,22.61-1.68"],
  "そ": ["M38.4,22c1.88,1.25,4.98,1.05,7.5,0.38c6.5-1.75,13.25-3.75,19.38-5.38c4.63-1.23,7.18,2.06,3.62,5.25c-12.12,10.87-31.14,24.4-40,30.25c-6.25,4.12-5.88,5.75,1.38,3.88c17.08-4.42,35.96-8.68,50.12-10.38c9.38-1.12,9.62,0.12,0.5,1.38c-15.82,2.17-34.38,14.25-34.38,26.5c0,12.88,11.62,20.38,31.5,16.62"],
  "た": ["M24.38,35.38c1.38,0.62,3.88,1.51,6.38,1.12c6.5-1,16.25-2.88,24.88-4.75c2.64-0.57,5.38-1.5,7.62-2.38","M45,16.88c0.75,1.25,0.87,3.62,0.38,5.25c-6.35,20.94-12.75,36.37-18.88,52.37c-1.36,3.56-4.75,11.75-6,14.62","M56.38,53.25c12.38-2.75,18.25-3.7,23.62-3.12c15.12,1.62-1.12,2.25-4.25,4.88","M54.13,82.25c4.38,7,14.25,8.12,34.5,5.62"],
  "ち": ["M24.5,32.62c1.38,0.62,3.88,1.51,6.38,1.12c6.5-1,18.25-4.12,26.88-6c2.64-0.57,5.38-1.5,7.62-2.38","M45.62,15.62c0.75,1.25,0.71,3.58,0.38,5.25c-3,15-4.25,22.59-8.38,38.62c-3.25,12.62-5.38,11.12,3.62,4.38c8.29-6.21,19.75-9.5,28.5-9.5c8.62,0,14.58,5.88,14.5,14.5c-0.12,13.5-16.5,20.62-29.88,23.25"],
  "つ": ["M14,44.75c1.88,1.62,4.68,2.09,8.12,0.62c17.88-7.62,30-11.12,44.88-10.88c12.56,0.21,22.98,7.17,22.87,19.17c-0.18,18.77-24.75,28.71-45.01,32.08"],
  "て": ["M20.5,26.38c1.87,1.62,4.42,1.97,8.12,1.37c21.75-3.5,33-5.12,50.12-8.38c12.34-2.34,13-0.88,0.38,1.38c-17.89,3.19-33.78,19.12-33.78,37.62c0,20.5,17.91,30.25,35.16,30.25"],
  "と": ["M35.5,18.38c1.74,0.74,3.62,2.62,4.12,5.37c0.5,2.75,4.75,25,5.38,28.12","M78.12,25.5c0.25,1.88,0.04,4.09-2.25,5.75c-6.37,4.63-13.22,8.49-22.75,15.25c-12.88,9.12-21.62,18.38-21.62,27.5c0,10.12,8.5,13.88,26.88,13.88c6.25,0,14.75-0.12,21.62-1.25"],
  "な": ["M22.88,28.96c1.18,0.58,3.3,1.1,5.47,1.05c5.53-0.13,10.9-0.98,16.52-2.42c4.82-1.23,9.13-3.12,11.38-4.22","M42.99,14c0.63,0.89,0.56,2.52,0.31,3.72c-2.96,14.16-7.95,26.56-14.25,37.87c-2.05,3.69-4.25,7.24-6.55,10.65","M72.26,23.25c6.88,2.5,12.62,5.62,14.75,9.5c4.06,7.41-0.25,3.38-3.5,3.88","M68.88,44.62c-1,1.88-2.14,5.24-1.88,8.25c0.62,7,1.5,13.12,1.5,20.62c0,20-27.88,19.75-27.88,9.38c0-5.62,8.25-8.25,13.88-8.25c8.75,0,21.5,3.25,29.75,11.5"],
  "に": ["M24.53,22.75c1.25,1.5,1.62,3.75,1.12,6.38c-3,15.88-9,32.5-7.38,47.62c2.02,18.84,4.5,5.75,8.5-3.5","M53.2,30.64c0.96,0.79,2.44,1.58,5.1,1.35c6.98-0.61,15.01-3.3,22.04-3.36c13.19-0.11,1.5,3.75-8.39,7.35","M52.53,68c1.76,12.92,11.92,16.01,24.23,14.93c5.08-0.45,8.9-0.8,14.27-2.06"],
  "ぬ": ["M25.38,28.5c2,1.38,2.97,3.23,3.38,5.88c1.87,12.18,4.12,23.92,8.54,34.67c1.79,4.36,3.96,8.33,6.84,12.46","M57.12,19.25c0.88,2.12,1.06,3.79,0.62,5.88c-3.12,15-13.14,39.81-18.12,48.62c-11.87,21-20.62,1.25-20.62-4.5c0-22.63,43.75-44.25,62.36-29.59c7.66,6.03,9.8,14.58,9.14,23.34c-2,26.75-32.88,28.38-32.88,16.88c0-9.38,17.38-7.12,27.12-1.12c3.1,1.91,7.25,5.25,9.5,7.5"],
  "ね": ["M33.29,14.5c1.62,1.62,2.1,3.21,1.88,5.88c-1.03,11.93-2.06,31.66-2.53,53.12c-0.1,4.62-0.18,9.31-0.22,14","M17.16,37.88c1.62,0.88,3.25,1.38,5.62,0.75c2.14-0.56,7.8-2.31,12.37-4.03c6.26-2.35,6.88-1.47,3.12,3.63c-5.56,7.53-13.02,17.38-18.48,26.77c-5.6,9.62-3.45,8.3,2,3c19.12-18.62,38.5-39.12,54.12-39.12c11.38,0,12.88,11.25,12.88,32.5c0,28.62-30.18,24.88-30.18,16.26c0-9.63,18.73-7.82,28.06-1.88c2.75,1.75,5.88,4.88,7.5,6.75"],
  "の": ["M53.82,28.62c1,1.5,1.34,4.12,0.88,6.62c-1.75,9.5-6.89,25-10.75,33.12c-9.63,20.26-16.55,14.74-24.38-1.98c-9.13-19.5,23.5-48.88,50.63-40.38c32.38,10.15,28,54.62-4.75,60.88"],
  "は": ["M24.51,18c1.25,1.5,2.15,4,1.62,6.62c-3.5,17.62-6.98,36.4-4,54.88c2.5,15.5,1.12,2,5.62-6.25","M49.64,37.89c2.41,1.57,4.85,2.16,7.8,1.71c9.36-1.43,17.46-2.94,23.4-4.57c3.12-0.86,5.96-1.29,7.8-1.29","M69.77,16.5c2.25,2.12,2.88,4.12,2.88,6.5c0,2.38,1.5,38.62,1.5,48c0,22.5-30.62,19.62-30.62,10.5c0-9.75,23.88-5.62,29.5-2.88c5.62,2.74,11.98,8.26,13.36,9.38"],
  "ひ": ["M20,25.12c1.25,0.88,3.75,2.25,6.5,1.38c2.75-0.87,7.31-2.38,11.38-4.5c6-3.12,8.42-1.01,4.25,4c-27.13,32.62-23.76,58.5-1.52,62.88c18.07,3.56,37.63-16.38,35.63-56.51c-0.72-14.5-0.17-14.78,4.12-1.75c3.76,11.38,10.26,20.76,16.14,26.5"],
  "ふ": ["M42.63,15.62c3.62,3.38,7.5,5.38,12.74,6.13c9.59,1.37,3.5,3.38-1.88,6.12","M43.63,46.88c1.88,4.62,7.5,9.41,14.25,17.5c10.62,12.74,0.49,30-19.13,21.62","M16.5,73.38c0.75,4,1.88,8.12,5,10.12c1.16,0.74,0.12-3.38,13.25-9.12","M80.13,61.88c5.12,3.38,10.28,7.49,11.38,8.88c6.75,8.5-0.25,4.62-4.62,7.12"],
  "へ": ["M15,48.75c2.25,1.62,4.67,1.96,7-0.38c3.62-3.62,7.46-6.54,11.25-10.5c5.5-5.75,8.48-4.75,13.12-0.88c12.12,10.12,30.38,25.12,33.38,27.38c3,2.26,12.37,10.38,13.87,11.63"],
  "ほ": ["M24.51,18.75c1.25,1.5,2.15,4,1.62,6.62c-3.5,17.63-6.98,37.4-4,55.88c2.5,15.5,1.12,2,5.62-6.25","M53.08,21.13c1.9,1.28,3.82,1.76,6.14,1.4c7.36-1.17,13.73-2.4,18.41-3.73c2.46-0.7,4.69-1.05,6.13-1.05","M53.83,44.3c2.21,1.44,4.46,1.98,7.16,1.57c8.59-1.31,15.78-2.44,21.23-3.94c2.87-0.79,5.72-1.18,7.41-1.18","M72.51,23c1.38,1.62,1.62,4.12,1.62,6.5c0,2.38,2,35.12,2,44.5c0,17.5-29.88,17.12-29.88,8c0-9.75,21.38-7.88,29.5-2.88c5.33,3.28,12,8.25,13.38,9.38"],
  "ま": ["M29.83,32.28c2.2,1.15,4.43,1.5,7.14,1.26c11.54-1.04,25.94-3.12,34.66-4.85c2.87-0.57,5.45-0.44,7.13-0.44","M33.83,51.84c2.45,1.61,4.94,1.72,7.94,1.26c9.52-1.46,17.87-3.1,27.03-5.16c3.22-0.72,6.34-1.32,8.21-1.32","M55.81,14c1.52,1.8,1.8,4.57,1.8,7.19c0,2.63,0.46,43.88,0.46,54.25c0,21.3-30.07,19.96-30.07,9.86c0-10.79,25.88-9.93,38.57-3.18c6.12,3.25,11.55,6.38,14.8,9.13"],
  "み": ["M32.5,26c1.88,1.75,4.06,1.7,6.88,1.25c3.88-0.62,7.62-1.75,11.88-3.12c4.26-1.37,6.25-0.12,4.5,5.12c-1.75,5.24-6.66,17.39-12,30.12c-13.63,32.51-29.26,29.26-29.26,18.63c0-14.25,20.48-15.36,33-13.5c18.5,2.75,30,6.62,44.38,14.25","M79.38,54.75c0.75,2.38,0.49,4.37,0,6.25c-2.12,8.12-7.5,25-22.12,33.75"],
  "む": ["M19.59,31.65c2.1,1.55,4.24,1.66,6.81,1.21c8.17-1.41,15.33-2.98,23.19-4.96c2.76-0.69,5.44-1.27,7.05-1.27","M37.02,15.5c1.62,1.25,2.31,2.88,2.12,5.25c-0.88,11.12-1.5,20.75-4,34.88c-3.61,20.44-19.25,16.99-18.62,7.37c0.5-7.74,6.25-12.86,12.62-13.5c5-0.5,14.28,1.93,5.88,15c-12.62,19.62-11.42,24.51,5.11,25.54c10.98,0.68,19.26,0.72,28.49-0.92c14.15-2.5,7.4-2.63,7.4-11.13","M78.52,36.25c6.88,3.12,11.71,5.95,14.88,10.12c6.25,8.25-1.38,3.62-4.5,4.5"],
  "め": ["M27.48,31.75c1.75,1,2.41,3.09,2.5,5.25c0.5,11.62,2.75,23.5,7.25,31.38c1.39,2.44,5.38,8.5,7.25,10.38","M59.6,19.38c1,1.5,1.35,4.12,0.88,6.62c-2.75,14.62-13.62,37.75-20.1,47.24c-12.28,17.14-16.78,13.14-22.28,0.64c-5.38-15.38,26.4-42.18,53.42-35.28c29.08,8.27,23.96,46.02-7.98,50.15"],
  "も": ["M49.17,14.75c1.88,1.88,1.86,4.52,1.12,8c-3,14.25-5,26.62-7,42.12c-2.55,19.73-0.75,29.88,17,29.86c20.25-0.02,28.63-13.11,20.01-35.73","M26.54,34.62c1.12,0.88,2.87,2.21,6,2c11.12-0.75,20-2.12,27.74-3.46c3.88-0.67,5.88-1.17,8.88-1.04","M26.42,53.38c-1.5,4,1,6.75,7.75,6.75c8.75,0,17.62-1,22.88-1.88c2.01-0.33,5.38-1,7.5-1.75"],
  "や": ["M18,49.38c1.88,1.62,5.25,2.5,8.62,0.88c18.51-8.88,35.76-19.38,50.83-19.26c9.02,0.14,16.01,4.13,15.93,12.29c0,8.33-10.88,16.58-24.5,17.83","M47.13,15.88c5.12,0.88,10.41,4.05,11.5,6.62c2.12,5-1,2.38-2.88,2.62","M30,24.38c2.38,1.88,3.28,2.87,3.88,5.25c2.62,10.5,11.12,41.12,14.75,52.5c0.65,2.04,1.88,6.25,2.88,9.38"],
  "ゆ": ["M21.05,25.38c1.38,1.5,2.02,4.13,1.5,6.25c-2.88,11.75-4,22.25-2.12,35c2.77,18.85,1.12,3.88,3.25-1.5c9-22.75,27.24-34.5,44.38-34.5c16.88,0,21.88,11.38,21.88,20.25c0,27.38-30.88,29.62-43,16.75","M58.42,16.75c2.62,1.75,3.17,3.13,3.5,7.12c0.88,10.5,1.4,18.72,1.62,29.38c0.5,24-6.25,32-12.38,39.25"],
  "よ": ["M58.24,35.38c7.5-1.28,13.74-2.63,18.5-4.1c2.5-0.77,4.77-1.15,6.25-1.15","M54.62,13.88c2.25,2.12,2.98,4.13,2.88,6.5c-0.75,17-0.12,34.88,1.39,53.5c1.88,23.07-34.89,20.88-34.89,11.5c0-12,26.25-8,35.98-4.12c8.1,3.23,11.52,4.88,18.52,10.38"],
  "ら": ["M35.33,15c3.75,3,9.22,4.41,16.5,4.25c11.12-0.25-0.25,2.38-1.25,3.5","M35.83,35.75c-2.14,4.34-2.79,8.67-3.11,13.24c-0.42,5.84-0.31,12.05-2.14,19.13c-3.16,12.27,1.49,4.77,3,3.5c11.88-10,21.7-12.67,32.61-12.49c9.21,0.15,16.85,5.19,16.76,13.88c-0.12,13.6-14.24,21.49-32.49,22.49"],
  "り": ["M38.75,25.25c1.25,1.5,2.24,4.03,1.62,6.62c-2.88,12.13-6.29,29.65-4.25,42.38c2,12.5,1.75-0.75,5.62-6.25","M69.37,18.75c2.25,2.12,2.88,4.12,2.88,6.5c0,2.38,0,26.38,0,35.75c0,16.5-5,25.75-12.62,33.12"],
  "る": ["M34.31,20.38c1.75,1.25,4.62,2.62,8.5,1.5c3.88-1.12,9.62-2.5,15.62-4.62c6-2.12,7.5-0.12,4.38,4.25c-3.12,4.37-18.89,24.62-27.75,34c-8.5,9-13.09,11.89,0.75,3.25c15.62-9.75,43-10.88,43,13.38c0,22.5-40.88,24.5-40.88,12.62c0-11.25,18.12-8.75,24.38-0.38"],
  "れ": ["M34.48,13c1.5,1.38,2.83,3.74,2.5,6.38c-0.5,4-2.75,44.5-2.75,52.88c0,8.38,0.12,16.62,0.12,19.5","M16.98,40.75c2.12,1.38,3.74,1.46,7.5,0c4.5-1.75,6.55-2.66,13-5.5c4.25-1.88,4.4,0.24,2.5,3.5c-5.25,9-10.5,16.75-18.88,27.62c-7.55,9.81-6.93,12.85,3.25,3.12c14-13.38,20.34-19.76,33.88-32.5c6.38-6,19.39-12.09,18.14,0.88c-1.02,10.63-1.89,22.13-2.29,30.75c-1.02,21.71,11.53,18,20.15,8.63"],
  "ろ": ["M36.95,21.88c1.5,2,4.62,3.62,8.5,2.5c3.88-1.12,8.12-2.25,14.12-4.38c6-2.13,6.53-0.1,3.38,4.25c-7.88,10.88-18,22.75-27.5,35.25c-7.49,9.86-10.68,11.32,2.88,2.25c17.38-11.62,46.62-14,46.62,8.12c0,15.62-16,22.5-32.12,25.12"],
  "わ": ["M38.53,14.75c1.5,1.38,2.22,3.73,2,6.38c-1,11.87-2.75,44.49-2.75,52.87c0,8.38-0.62,16.62-0.62,19.5","M17.53,40.75c2.12,1.38,3.68,1.3,7.5,0c5.88-2,9.8-3.16,16.25-6c4.25-1.88,6.12,0,2.75,4c-6.72,7.96-13,16.5-22.12,27.88c-7.75,9.66-7.54,12.21,3,2.88c21.88-19.38,49.75-35.62,63.5-21c14.36,15.27,1.62,36.62-23.38,42.62"],
  "を": ["M28.56,27.87c1.62,1.13,3.17,1.64,6.01,1.12c10.86-1.99,16.74-3.37,24.71-4.72c3.64-0.62,5.65-0.93,8.4-0.75","M49.93,14.38c0.75,1,1.48,3.22,0.38,5.62c-4.62,10.12-10,20.75-17.12,30.25c-9.25,12.33-9.25,11.19,2.12,2.5c9-6.88,23.75-12.12,22.88,19.88","M83.06,39.88c0.62,1.75,0,4-3,5.75c-3,1.75-49.62,24.16-44.75,38.25c3.28,9.48,17.93,9.12,29.98,7.75c4.48-0.51,9.15-1.12,12.4-1.75"],
  "ん": ["M56.35,16.5c0.75,1.75,1.13,5.83-0.38,8.25c-7,11.25-27.22,43.47-33.88,54.37c-9,14.75-7.62,16.25,1.5,1.25c17.86-29.36,32-23.76,32-6.75c0,25,19,26.5,34.25-5"]
};

export const KANA_CHART_ROWS = [
  ['',  'あいうえお', 'a i u e o'],
  ['k', 'かきくけこ', 'ka ki ku ke ko'],
  ['s', 'さしすせそ', 'sa shi su se so'],
  ['t', 'たちつてと', 'ta chi tsu te to'],
  ['n', 'なにぬねの', 'na ni nu ne no'],
  ['h', 'はひふへほ', 'ha hi fu he ho'],
  ['m', 'まみむめも', 'ma mi mu me mo'],
  ['y', 'や・ゆ・よ', 'ya - yu - yo'],
  ['r', 'らりるれろ', 'ra ri ru re ro'],
  ['w', 'わ・・・を', 'wa - - - wo'],
  ['',  'ん・・・・', 'n - - - -']
];

export const KANA_ROMAJI = {};
KANA_CHART_ROWS.forEach(([, ks, rs]) => {
  const r = rs.split(' ');
  [...ks].forEach((k, i) => {
    if (k !== '・') KANA_ROMAJI[k] = r[i];
  });
});

export const KANA_TIPS = {
  // Row 1: あ
  'あ': '3 goresan. Garis pendek mendatar, garis panjang menurun agak melengkung, lalu lingkaran yang menyilang dan memutar lebar ke kanan.',
  'い': '2 goresan. Goresan kiri lebih panjang dan mencentang naik di ujung bawah. Goresan kanan lebih pendek dan miring ke dalam. Beri jarak di antaranya.',
  'う': '2 goresan. Garis miring pendek di atas, lalu lengkungan besar yang naik, membelok ke kanan, dan menyapu turun ke kiri bawah.',
  'え': '2 goresan. Garis miring pendek di atas, lalu satu goresan zigzag: mendatar, turun tajam ke kiri, naik lagi, lalu melengkung ke kanan.',
  'お': '3 goresan. Garis mendatar, garis turun yang berputar membentuk lengkungan lebar ke kanan, lalu titik kecil di kanan atas.',
  // Row 2: か
  'か': '3 goresan. Garis mendatar yang berbelok tajam ke bawah dengan kait, garis miring memotong dari atas, dan titik miring di kanan.',
  'き': '4 goresan (gaya tulis tangan). Dua garis mendatar sejajar, garis miring turun memotong keduanya, lalu lengkungan terpisah di bawah.',
  'く': '1 goresan saja. Turun miring ke kiri, lalu berbelok tajam ke kanan bawah seperti tanda "<" yang lembut.',
  'け': '3 goresan. Goresan kiri turun vertikal dengan sedikit kait, garis mendatar di kanan, lalu garis vertikal kanan yang melengkung ke kiri bawah.',
  'こ': '2 goresan. Garis lengkung pendek di atas dengan kait kecil, lalu garis melengkung lebih lebar di bawah.',
  // Row 3: さ
  'さ': '3 goresan (gaya tulis tangan). Satu garis mendatar, satu garis miring memotongnya, lalu lengkungan terpisah di bawah (mirip き tetapi hanya 1 garis atas).',
  'し': '1 goresan. Turun lurus ke bawah lalu melengkung lebar ke kanan atas seperti kail pancing.',
  'す': '2 goresan. Garis mendatar panjang, lalu garis vertikal yang membentuk lingkaran kecil di tengah dan menyapu turun ke kiri.',
  'せ': '3 goresan. Garis mendatar panjang, garis vertikal kanan berkait pendek, lalu garis kiri turun dan membelok lurus ke kanan.',
  'そ': '1 goresan. Zigzag tajam di atas (seperti huruf Z) lalu langsung disambung lengkungan huruf C di bawah.',
  // Row 4: た
  'た': '4 goresan. Garis mendatar pendek, garis miring panjang ke kiri bawah, lalu dua garis kecil di kanan (seperti こ).',
  'ち': '2 goresan. Garis mendatar pendek, lalu garis turun yang melengkung besar ke kanan bawah seperti angka "5".',
  'つ': '1 goresan. Melengkung lembut ke kanan lalu memutar ke bawah kiri seperti ombak.',
  'て': '1 goresan. Garis mendatar sedikit naik lalu langsung membelok turun melengkung besar ke kanan.',
  'と': '2 goresan. Goresan pendek miring ke kanan bawah, lalu lengkungan besar dari kanan atas turun dan melengkung mendatar di bawah.',
  // Row 5: な
  'な': '4 goresan. Tanda silang kecil di kiri atas (seperti awal た), titik miring di kanan atas, lalu garis turun melingkar simpul di bawah.',
  'に': '3 goresan. Garis vertikal kiri berkait halus, lalu dua garis lengkung sejajar di kanan (seperti こ).',
  'ぬ': '2 goresan. Goresan melengkung turun ke kanan, lalu garis kedua memotong, berputar besar ke kanan, dan berakhir dengan simpul kecil.',
  'ね': '2 goresan. Garis vertikal lurus, lalu zigzag menyilang garis tersebut, membelok lebar ke kanan dan berakhir dengan simpul kecil.',
  'の': '1 goresan. Mulai agak kanan atas, turun ke kiri membentuk lengkungan penuh memutar searah jarum jam.',
  // Row 6: は
  'は': '3 goresan. Garis vertikal kiri berkait, garis mendatar di kanan, lalu garis vertikal kanan yang turun dan membentuk simpul di bawah.',
  'ひ': '1 goresan. Naik sedikit lalu turun membentuk mangkuk huruf "U" lebar, naik tinggi lalu turun singkat di kanan.',
  'ふ': '4 goresan. Titik kecil di atas, lengkungan di tengah bawah, lalu dua titik pengapit di kiri dan kanan.',
  'へ': '1 goresan. Naik pendek ke atas lalu turun panjang ke kanan bawah seperti atap gunung.',
  'ほ': '4 goresan. Seperti は tetapi memiliki DUA garis mendatar sejajar di sebelah kanan; garis vertikal kanan tidak menembus garis atas.',
  // Row 7: ま
  'ま': '3 goresan. Dua garis mendatar sejajar (atas lebih panjang), lalu garis vertikal memotong keduanya dan berakhir dengan simpul di bawah.',
  'み': '2 goresan. Garis zigzag yang membuat simpul di kiri bawah lalu melintang ke kanan, kemudian garis pendek memotong di kanan.',
  'む': '3 goresan. Garis mendatar, garis turun dengan simpul kecil yang langsung memanjang ke kanan dan naik, lalu titik di kanan atas.',
  'め': '2 goresan. Mirip ぬ tetapi TANPA simpul di ujung akhir — berhenti bersih dengan lengkungan besar.',
  'も': '3 goresan. Garis vertikal melengkung (seperti し) dulu, baru dua garis mendatar memotongnya dari atas ke bawah.',
  // Row 8: や
  'や': '3 goresan. Lengkungan lebar dari kiri ke kanan atas lalu turun, titik kecil di atas, lalu garis miring panjang turun ke kanan bawah.',
  'ゆ': '2 goresan. Garis vertikal kiri yang memutar lebar membentuk lingkaran ke kanan, lalu garis vertikal memotong bagian kanan lingkaran.',
  'よ': '2 goresan. Garis mendatar pendek di kanan dulu, lalu garis vertikal turun yang membentuk simpul kecil di bawah.',
  // Row 9: ら
  'ら': '2 goresan. Titik miring pendek di atas, lalu garis turun ke kiri yang langsung memutar besar ke kanan bawah (mirip angka 5).',
  'り': '2 goresan (gaya tulis tangan). Garis kiri pendek berkait, garis kanan lebih panjang turun lalu melengkung ke kiri bawah.',
  'る': '1 goresan. Zigzag di atas seperti そ lalu berputar besar ke kanan dan menutup dengan simpul kecil di bawah.',
  'れ': '2 goresan. Seperti ね tetapi ujung kanannya TIDAK bersimpul — melainkan meluncur keluar ke kanan atas.',
  'ろ': '1 goresan. Persis seperti る tetapi TANPA simpul di akhir.',
  // Row 10: わ・を・ん
  'わ': '2 goresan. Garis vertikal, lalu zigzag menyilang dan berputar lebar ke kanan bawah tanpa simpul (mirip ね tanpa simpul).',
  'を': '3 goresan. Garis mendatar, garis turun zigzag (seperti huruf h kecil), lalu lengkungan huruf C memotong dari kanan.',
  'ん': '1 goresan. Turun miring panjang ke kiri bawah, naik sedikit menyusuri garis, lalu melengkung seperti huruf "h" kecil ke kanan atas.'
};

export const KANA_ROW_LESSONS = [
  {
    id: 'row_a',
    label: 'Baris あ',
    shortLabel: 'あ行',
    kana: ['あ', 'い', 'う', 'え', 'お'],
    slipNote: 'Kesalahan umum: dua goresan い saling menyentuh, lingkaran あ terlalu kecil, atau titik kanan atas お terlupa.',
    words: [
      ['いえ', 'ie', 'rumah'],
      ['うえ', 'ue', 'atas'],
      ['あおい', 'aoi', 'biru'],
      ['いいえ', 'iie', 'tidak'],
      ['え', 'e', 'gambar / lukisan'],
      ['あう', 'au', 'bertemu']
    ]
  },
  {
    id: 'row_ka',
    label: 'Baris か',
    shortLabel: 'か行',
    kana: ['か', 'き', 'く', 'け', 'こ'],
    slipNote: 'Kesalahan umum: き tulis tangan bagian bawahnya terpisah (bukan tersambung seperti font komputer).',
    words: [
      ['あかい', 'akai', 'merah'],
      ['えき', 'eki', 'stasiun'],
      ['いけ', 'ike', 'kolam'],
      ['かお', 'kao', 'wajah'],
      ['きく', 'kiku', 'mendengar / bunga krisan'],
      ['こえ', 'koe', 'suara']
    ]
  },
  {
    id: 'row_sa',
    label: 'Baris さ',
    shortLabel: 'さ行',
    kana: ['さ', 'し', 'す', 'せ', 'そ'],
    slipNote: 'Kesalahan umum: tertukar antara さ (1 garis atas) dan き (2 garis atas), atau lingkaran す terlalu besar.',
    words: [
      ['かさ', 'kasa', 'payung'],
      ['すし', 'sushi', 'sushi'],
      ['あさ', 'asa', 'pagi'],
      ['いす', 'isu', 'kursi'],
      ['せかい', 'sekai', 'dunia'],
      ['うそ', 'uso', 'bohong']
    ]
  },
  {
    id: 'row_ta',
    label: 'Baris た',
    shortLabel: 'た行',
    kana: ['た', 'ち', 'つ', 'て', 'と'],
    slipNote: 'Kesalahan umum: ち menghadap kanan (seperti 5), sedangkan さ menghadap kiri.',
    words: [
      ['くつ', 'kutsu', 'sepatu'],
      ['あした', 'ashita', 'besok'],
      ['ちかい', 'chikai', 'dekat'],
      ['て', 'te', 'tangan'],
      ['そと', 'soto', 'luar'],
      ['たかい', 'takai', 'tinggi / mahal']
    ]
  },
  {
    id: 'row_na',
    label: 'Baris な',
    shortLabel: 'な行',
    kana: ['な', 'に', 'ぬ', 'ね', 'の'],
    slipNote: 'Kesalahan umum: ぬ dan ね sama-sama memiliki simpul di ujung kanan bawah.',
    words: [
      ['いぬ', 'inu', 'anjing'],
      ['ねこ', 'neko', 'kucing'],
      ['にく', 'niku', 'daging'],
      ['なつ', 'natsu', 'musim panas'],
      ['おかね', 'okane', 'uang'],
      ['くに', 'kuni', 'negara']
    ]
  },
  {
    id: 'row_ha',
    label: 'Baris は',
    shortLabel: 'は行',
    kana: ['は', 'ひ', 'ふ', 'へ', 'ほ'],
    slipNote: 'Kesalahan umum: garis vertikal kanan pada ほ tidak menembus garis mendatar paling atas.',
    words: [
      ['はな', 'hana', 'bunga / hidung'],
      ['ひと', 'hito', 'orang'],
      ['ふね', 'fune', 'kapal'],
      ['へた', 'heta', 'tidak mahir'],
      ['ほし', 'hoshi', 'bintang'],
      ['はは', 'haha', 'ibu (sendiri)']
    ]
  },
  {
    id: 'row_ma',
    label: 'Baris ま',
    shortLabel: 'ま行',
    kana: ['ま', 'み', 'む', 'め', 'も'],
    slipNote: 'Kesalahan umum: tertukar antara め (tanpa simpul) dan ぬ (ada simpul); urutan も mulai dari garis vertikal dulu.',
    words: [
      ['まち', 'machi', 'kota'],
      ['みみ', 'mimi', 'telinga'],
      ['むし', 'mushi', 'serangga'],
      ['あめ', 'ame', 'hujan / permen'],
      ['もの', 'mono', 'barang / benda'],
      ['のみもの', 'nomimono', 'minuman']
    ]
  },
  {
    id: 'row_ya',
    label: 'Baris や',
    shortLabel: 'や行',
    kana: ['や', 'ゆ', 'よ'],
    slipNote: 'Kesalahan umum: garis mendatar kecil pada よ ditulis lebih dulu sebelum garis vertikalnya.',
    words: [
      ['やま', 'yama', 'gunung'],
      ['ゆき', 'yuki', 'salju'],
      ['よむ', 'yomu', 'membaca'],
      ['へや', 'heya', 'kamar'],
      ['やすい', 'yasui', 'murah'],
      ['ゆめ', 'yume', 'mimpi']
    ]
  },
  {
    id: 'row_ra',
    label: 'Baris ら',
    shortLabel: 'ら行',
    kana: ['ら', 'り', 'る', 'れ', 'ろ'],
    slipNote: 'Kesalahan umum: bedakan る (ada simpul di ujung) vs ろ (tanpa simpul), dan れ (melengkung keluar) vs ね (bersimpul).',
    words: [
      ['さくら', 'sakura', 'bunga sakura'],
      ['くるま', 'kuruma', 'mobil'],
      ['よる', 'yoru', 'malam'],
      ['これ', 'kore', 'ini'],
      ['しろい', 'shiroi', 'putih'],
      ['くすり', 'kusuri', 'obat']
    ]
  },
  {
    id: 'row_wa',
    label: 'Baris わ・を・ん',
    shortLabel: 'わ・ん行',
    kana: ['わ', 'を', 'ん'],
    slipNote: 'Kesalahan umum: を dipakai sebagai partikel objek (dibaca "o"); ん selalu berdiri di akhir suku kata.',
    words: [
      ['わたし', 'watashi', 'saya'],
      ['かわ', 'kawa', 'sungai'],
      ['ほん', 'hon', 'buku'],
      ['にほん', 'nihon', 'Jepang'],
      ['せんせい', 'sensei', 'guru / dosen'],
      ['しんぶん', 'shinbun', 'koran']
    ]
  }
];
