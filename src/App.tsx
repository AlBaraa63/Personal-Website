import { ThemeProvider } from '@/context/ThemeContext';
import ErrorBoundary from '@/components/ui/ErrorBoundary';
import { OSProvider } from '@/context/OSContext';
import { SoundProvider } from '@/context/SoundContext';
import Desktop from '@/components/os/Desktop';
import CustomCursor from '@/components/effects/CustomCursor';

function App() {
  return (
    <ErrorBoundary>
      <SoundProvider>
        <OSProvider>
          <ThemeProvider>
            {/* Custom Cursor */}
            <CustomCursor />
            {/* 
              The OSProvider wraps everything. 
              The 'Desktop' component is the main view manager. 
              We no longer use specific Layout/Hero components directly here.
              They are loaded as 'Apps' inside Desktop.tsx 
            */}
            <Desktop />
          </ThemeProvider>
        </OSProvider>
      </SoundProvider>
    </ErrorBoundary>
  );
}

export default App;
