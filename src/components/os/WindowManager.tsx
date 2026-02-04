import React from 'react';
import { useOS } from '@/context/OSContext';
import Window from './Window';

const WindowManager: React.FC = () => {
    const { windows } = useOS();

    return (
        <>
            {Object.values(windows).map((window) => (
                <Window key={window.id} id={window.id} />
            ))}
        </>
    );
};

export default WindowManager;
