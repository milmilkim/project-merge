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
        galmuri14: ['galmuri14'],
        galmuri9: ['galmuri9'],
        pyeongchang: ['pyeongchang'],
        // 5회 전용 — 둥글통통 Cafe24 Ssurround
        ed5: ['Cafe24Ssurround', 'sans-serif'],
        // 6회 OS 크롬 UI — Tahoma 계열
        os: ['Tahoma', 'sans-serif'],
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
        // 6회 — Y2K 레트로 컴퓨팅(Windows XP / SD CRT) 테마
        ed6: {
          lunaBlue: '#0b52d6',
          lunaBlue2: '#0997ff',
          silver: '#ECE9D8',
          silverBorder: '#0831b8',
          startGreen: '#2c8417',
          accent: '#19e3d6',
          skyTop: '#15a8e6',
          skyBot: '#b6ecff',
          hillTop: '#7ec850',
          hillBot: '#367f25',
          text: '#1a1a1a',
        },
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
