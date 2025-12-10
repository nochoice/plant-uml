import { type RouteConfig, index, route } from '@react-router/dev/routes';

export default [
  index('routes/home.tsx'),
  route('/about', 'routes/about.tsx'),
  route('/ooo', 'routes/ooo+/index.tsx'),
  route('/ooo/ufff', 'routes/ooo+/ufff.tsx'),
  route('/plant-uml-image', 'routes/plant-uml-image.tsx'),
] satisfies RouteConfig;
