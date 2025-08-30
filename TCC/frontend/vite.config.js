export default {
  server: {
    proxy: {
      '/modelo3d': 'http://localhost:8080',
      '/estruturas': 'http://localhost:8080',
    },
  },
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
        home: 'home.html'
      }
    }
  }
};
