import { getPublicPrismaClient } from '@/app/lib/prisma';
import { NavLinkData } from './definitions';

export async function fetchNavLinks(): Promise<NavLinkData[]> {
    const publicPrisma = getPublicPrismaClient();
    
    try {
        const features = await publicPrisma.feature.findMany();

        const featuresById = new Map(features.map(f => [f.id, { ...f, children: [] }]));
        const rootLinks: NavLinkData[] = [];

        for (const feature of features) {
            const navLink: NavLinkData = {
                name: feature.name,
                href: feature.href ?? '',
                featureKey: feature.key,
                icon: feature.icon,
                children: [],
            };

            if (feature.parentId) {
                const parent = featuresById.get(feature.parentId);
                if (parent) {
                    // @ts-ignore
                    parent.children.push(navLink);
                }
            } else {
                // @ts-ignore
                navLink.children = featuresById.get(feature.id)?.children;
                rootLinks.push(navLink);
            }
        }

        return rootLinks;

    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch navigation links.');
    }
}
