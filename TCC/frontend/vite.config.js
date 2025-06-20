export default {
  server: {
    proxy: {
      '/modelo3d': 'http://localhost:8080',
      '/estruturas': 'http://localhost:8080',
    },
  },
};
