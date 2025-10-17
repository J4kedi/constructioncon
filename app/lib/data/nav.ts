import { getPublicPrismaClient } from '@/app/lib/prisma';

export async function fetchNavLinks() {
    const publicPrisma = getPublicPrismaClient();
    
    try {
        const features = await publicPrisma.feature.findMany({
            orderBy: { name: 'asc' }
        });

        const navLinks = features.map(feature => ({
            name: feature.name,
            href: feature.href,
            featureKey: feature.key,
            icon: feature.icon,
        }));

        return navLinks;

    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch navigation links.');
    }
}
