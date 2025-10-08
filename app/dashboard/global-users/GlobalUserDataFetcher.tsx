import { fetchFilteredGlobalUsers, fetchGlobalUsersTotalPages } from '@/app/lib/data/user';
import GlobalUsersPageContent from '@/app/ui/dashboard/super-admin/global-users-page';

export default async function GlobalUserDataFetcher({ searchParams }: { searchParams: { [key: string]: string | undefined } }) {
    const query = searchParams?.query || '';
    const currentPage = Number(searchParams?.page) || 1;

    const [users, totalPages] = await Promise.all([
        fetchFilteredGlobalUsers(query, currentPage),
        fetchGlobalUsersTotalPages(query),
    ]);

    return <GlobalUsersPageContent users={users} totalPages={totalPages} />;
}