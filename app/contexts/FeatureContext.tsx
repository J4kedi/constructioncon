import { createContext, useContext, ReactNode } from 'react';

interface FeatureContextType {
    activeFeatures: Set<string>;
    hasFeature: (key: string) => boolean;
}

const FeatureContext = createContext<FeatureContextType | undefined>(undefined);

export function FeatureProvider({ children, features }: { children: ReactNode, features: string[] }) {
    const activeFeatures = new Set(features);
    const hasFeature = (key: string) => activeFeatures.has(key);

    return (
        <FeatureContext.Provider value={{ activeFeatures, hasFeature }}>
            {children}
        </FeatureContext.Provider>
    );
}

export function useFeatures() {
    const context = useContext(FeatureContext);
    if (context === undefined) {
        throw new Error('useFeatures must be used within a FeatureProvider');
    }
    return context;
}