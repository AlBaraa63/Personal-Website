// React import not required with the new JSX transform
import { ThemeProvider } from '@/context/ThemeContext';
import ErrorBoundary from '@/components/ui/ErrorBoundary';
import Layout from '@/components/common/Layout';
import Hero from '@/components/sections/Hero';
import About from '@/components/sections/About';
import Projects from '@/components/sections/Projects';
import Research from '@/components/sections/Research';
import Certifications from '@/components/sections/Certifications';
import Contact from '@/components/sections/Contact';
import Experience from '@/components/sections/Experience';

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
