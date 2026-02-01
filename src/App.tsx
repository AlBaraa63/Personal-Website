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
import Experience from './components/Experience';

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <Layout>
          <Hero />
          <About />
          <Experience />
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
