'use server';

import { signOut } from "../actions/auth";
import { redirect } from 'next/navigation';

export async function handleSignOut() {
    await signOut({ redirect: false });
    redirect('/login');
}