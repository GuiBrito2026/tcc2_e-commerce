import { useState } from 'react';

export default function ThemeToggle() {
  const [dark, setDark] = useState(() => document.documentElement.dataset.theme === 'dark');

  function toggleTheme() {
    const next = !dark;
    const theme = next ? 'dark' : 'light';
    document.documentElement.dataset.theme = theme;
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute('content', next ? '#181817' : '#faf9f6');
    setDark(next);
    try {
      localStorage.setItem('conecta.theme', theme);
    } catch {
      // The control still works when browser storage is unavailable.
    }
  }

  return (
    <button className="theme-toggle" type="button" aria-pressed={dark} onClick={toggleTheme}>
      <span aria-hidden="true">{dark ? '☀' : '☾'}</span>
      Modo escuro
    </button>
  );
}
