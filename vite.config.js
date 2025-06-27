import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Certifique-se de que o idioma padrão do navegador não está interferindo
    headers: {
      'Content-Language': 'en', // Define o idioma padrão como inglês
    },
  },
});