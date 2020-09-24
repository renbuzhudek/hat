import { promisifyAll } from './promise';
const wxs = {};
export { promisify, promisifyAll } from './promise';
promisifyAll(wx, wxs);
export default wxs;
