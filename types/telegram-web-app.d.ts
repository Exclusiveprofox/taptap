interface TelegramWebApp {
    WebApp: {
        ready: () => void;
        HapticFeedback: {
            impactOccurred: (style: 'light' | 'medium' | 'heavy') => void;
            notificationOccurred: (type: 'error' | 'success' | 'warning') => void;
            selectionChanged: () => void;
        };
        // Add other Telegram WebApp properties and methods as needed
    };
}

interface Window {
    Telegram: TelegramWebApp;
}