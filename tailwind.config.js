/* eslint-disable no-undef */
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      fontFamily: {
        galmuri11: ['galmuri11'],
        pyeongchang: ['pyeongchang'],
        // 5회 전용 — 둥글통통 Cafe24 Ssurround
        ed5: ['Cafe24Ssurround', 'sans-serif'],
      },
      colors: {
        // 회차 무관 공통(기존 호환용 alias = 4회 값)
        background: '#0A0B26',
        point: '#D2FD50',
        primary: '#8589FE',
        // 4회 — 우주/다크 테마
        ed4: {
          bg: '#0A0B26',
          point: '#D2FD50',
          primary: '#8589FE',
          text: '#FFFFFF',
        },
        // 5회 — 아이시 홀로그래픽(라이트) 테마
        ed5: {
          bg: '#bdeaff',
          point: '#7b3ff2',
          primary: '#5a4b8b',
          text: '#3a2b6b',
        },
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
