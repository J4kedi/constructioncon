import { getPublicPrismaClient } from '@/app/lib/prisma';
import { FEATURE_UI_MAP } from '../feature-map';

export async function fetchNavLinks() {
    const publicPrisma = getPublicPrismaClient();
    
    try {
        const features = await publicPrisma.feature.findMany({
            orderBy: { name: 'asc' }
        });

        const navLinks = features.map(feature => {
            const uiDetails = FEATURE_UI_MAP[feature.key];
            if (!uiDetails) return null;

            return {
                name: feature.name,
                href: uiDetails.href,
                featureKey: feature.key,
            };
        }).filter(Boolean);

        return navLinks;

    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch navigation links.');
    }
}
