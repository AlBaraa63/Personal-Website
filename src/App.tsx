import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, useParams } from 'react-router-dom';
import ErrorBoundary from '@/components/ui/ErrorBoundary';
import { OSProvider } from '@/context/OSContext';
import { SoundProvider } from '@/context/SoundContext';
import { NotificationProvider } from '@/context/NotificationContext';
import { AchievementProvider } from '@/context/AchievementContext';
import Desktop from '@/components/os/Desktop';
import CustomCursor from '@/components/effects/CustomCursor';

// The recruiter view is a separate, OS-free route — lazy-loaded so its bundle
// never ships with the OS landing page.
const Resume = lazy(() => import('@/components/sections/Resume'));

// HOLO-OS is dark-first. The previous ThemeProvider/light-mode toggle was vestigial
// from an earlier non-OS version of the site and never rendered correctly inside the OS,
// so it's been removed.

// The full OS, wrapped in its provider tree. Rendered for `/` and `/projects/:id`.
// `deepLinkProjectId` comes from the route param — Desktop opens the Projects
// window and selects that project on load (invalid ids are ignored downstream).
function OSRoute() {
    const { id } = useParams();
    return (
        <ErrorBoundary>
            <SoundProvider>
                <OSProvider>
                    <NotificationProvider>
                        <AchievementProvider>
                            <CustomCursor />
                            <Desktop deepLinkProjectId={id} />
                        </AchievementProvider>
                    </NotificationProvider>
                </OSProvider>
            </SoundProvider>
        </ErrorBoundary>
    );
}

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route
                    path="/resume"
                    element={
                        <Suspense fallback={null}>
                            <Resume />
                        </Suspense>
                    }
                />
                <Route path="/projects/:id" element={<OSRoute />} />
                {/* `/` and any other path fall through to the OS, matching the
                    Vercel rewrite that serves index.html for unknown routes. */}
                <Route path="*" element={<OSRoute />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
