import { type RouteConfig, index, route } from '@react-router/dev/routes';

export default [
  index('routes/plant-uml-image.tsx'),
  route('/about', 'routes/about.tsx'),
  route('/home', 'routes/home.tsx'),
] satisfies RouteConfig;
