import { Loader } from '@googlemaps/js-api-loader';

// 废用（未知原因认证失败）
// 谷歌地图JS SDK加载器（因为没有NPM版本）
const mapLoader = new Loader({
  // apiKey: import.meta.env.VITE_APP_MAP_KEY,
  apiKey: 'AIzaSyCLkxXnD4DzuyUZgp0gMJDvIgFOiXZ7ZVE',
  version: 'weekly',
  libraries: ['places']
})

export default mapLoader;