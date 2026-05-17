import ErrorBoundary from '@/components/ui/ErrorBoundary';
import { OSProvider } from '@/context/OSContext';
import { SoundProvider } from '@/context/SoundContext';
import { NotificationProvider } from '@/context/NotificationContext';
import Desktop from '@/components/os/Desktop';
import CustomCursor from '@/components/effects/CustomCursor';

// HOLO-OS is dark-first. The previous ThemeProvider/light-mode toggle was vestigial
// from an earlier non-OS version of the site and never rendered correctly inside the OS,
// so it's been removed.
function App() {
    return (
        <ErrorBoundary>
            <SoundProvider>
                <OSProvider>
                    <NotificationProvider>
                        <CustomCursor />
                        <Desktop />
                    </NotificationProvider>
                </OSProvider>
            </SoundProvider>
        </ErrorBoundary>
    );
}

export default App;
