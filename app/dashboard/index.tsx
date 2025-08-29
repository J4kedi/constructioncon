import { GetServerSideProps } from "next";

export const getServerSideProps: GetServerSideProps = async (context) => {
    const featureKeysHeader = context.req.headers['x-tenant-features'] as string | undefined;
    const featureKeys = featureKeysHeader?.split(',') || [];

    return {
        props: {
            featureKeys,
        },
    };
};