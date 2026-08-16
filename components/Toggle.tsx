// components/Toggle.tsx

import React from 'react';

interface ToggleProps {
    enabled: boolean;
    setEnabled: (enabled: boolean) => void;
}

export default function Toggle({ enabled, setEnabled }: ToggleProps) {
    return (
        <button
            className={`${enabled ? 'bg-[#f3ba2f]' : 'bg-gray-500'
                } relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none`}
            onClick={() => setEnabled(!enabled)}
        >
            <span
                className={`${enabled ? 'translate-x-6' : 'translate-x-1'
                    } inline-block w-4 h-4 transform bg-white rounded-full transition-transform`}
            />
        </button>
    );
}