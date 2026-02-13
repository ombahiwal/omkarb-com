import React, { lazy, Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import './styles/global.css';

const App = lazy(() => import('./App.jsx'));
const ViraJourneyApp = lazy(() => import('./vira/ViraJourneyApp.jsx'));

const isViraPath = window.location.pathname.replace(/\/+$/, '') === '/vira';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Suspense fallback={null}>
      {isViraPath ? <ViraJourneyApp /> : <App />}
    </Suspense>
  </React.StrictMode>
);
