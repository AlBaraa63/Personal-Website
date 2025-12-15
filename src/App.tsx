// React import not required with the new JSX transform
import { ThemeProvider } from './context/ThemeContext';
import ErrorBoundary from './components/ErrorBoundary';
import Layout from './components/Layout';
import Hero from './components/Hero';
import About from './components/About';
import Projects from './components/Projects';
import Research from './components/Research';
import Certifications from './components/Certifications';
import Contact from './components/Contact';

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <Layout>
          <Hero />
          <About />
          <Projects />
          <Research />
          <Certifications />
          <Contact />
        </Layout>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
