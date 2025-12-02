import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/addRestaurant': 'http://localhost:3000',
      '/getRestaurants': 'http://localhost:3000',
      '/deleteRestaurant': 'http://localhost:3000',
      '/updateRestaurantImage': 'http://localhost:3000',
      '/updateRestaurantName': 'http://localhost:3000',
      '/uploads': 'http://localhost:3000'
    }
  }
})
