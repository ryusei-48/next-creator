import { redirect } from 'next/navigation';
import { options as authOptions } from '@/lib/auth-options';
import { getServerSession } from 'next-auth';

export default async function auth() {

    const session = await getServerSession( authOptions );

    if ( session ) {
        redirect( '/' );
    }else redirect( '/auth/login' );

    //return <></>;
}