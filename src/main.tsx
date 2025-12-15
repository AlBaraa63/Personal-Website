import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App.tsx';
import ProjectDetailsPage from './pages/ProjectDetailsPage';
import PageTransition from './components/PageTransition';
import './index.css';
import { ThemeProvider } from './context/ThemeContext';

const router = createBrowserRouter([
  { 
    path: '/', 
    element: (
      <PageTransition>
        <App />
      </PageTransition>
    )
  },
  { 
    path: '/projects/:id', 
    element: (
      <PageTransition>
        <ProjectDetailsPage />
      </PageTransition>
    )
  }
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  </StrictMode>
);
