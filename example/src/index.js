import { createRoot } from 'react-dom/client';
import App from './App';
import { changeVersion } from '@vgbire/react-keep-alive';

changeVersion(6);

const rootElement = document.getElementById('root');
const root = createRoot(rootElement);

root.render(<App />);
