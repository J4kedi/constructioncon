import { FeatureProvider } from '@/app/contexts/FeatureContext';
import type { AppProps } from 'next/app';

function MyApp({ Component, pageProps }: AppProps) {
    const { featureKeys, ...otherPageProps } = pageProps;

    return (
        <FeatureProvider features={featureKeys || []}>
            <Component {...otherPageProps} />
        </FeatureProvider>
    );
}

export default MyApp;