import { resolve } from 'path';
import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';
// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '@': resolve(__dirname, './src'),
            '@/components': resolve(__dirname, './src/components'),
            '@/types': resolve(__dirname, './src/types'),
            '@/utils': resolve(__dirname, './src/utils'),
            '@/hooks': resolve(__dirname, './src/hooks'),
            '@/services': resolve(__dirname, './src/services'),
            '@/constants': resolve(__dirname, './src/constants'),
        },
    },
    server: {
        port: 3000,
        open: true,
    },
    build: {
        outDir: 'dist',
        sourcemap: true,
        rollupOptions: {
            output: {
                manualChunks: {
                    vendor: ['react', 'react-dom'],
                    router: ['react-router-dom'],
                    query: ['@tanstack/react-query'],
                },
            },
        },
    },
});
