import { getServerSession } from 'next-auth/next';
import { options } from '@/lib/auth-options';
import type { NextRequest } from 'next/server';
import { NextResponse } from "next/server";
import { PrismaClient, Prisma } from '@prisma/client';
import { writeFile } from 'fs/promises';
import { getSavePath } from '@/lib/functions';
import myConfig from '@/public.config.json';

const prisma = new PrismaClient();

async function CategoryUpdate( req: NextRequest ) {
  
  const session = await getServerSession( options );
  if ( !session ) return NextResponse.json({ message: 'unauthenticated' }, { status: 401 });

  const formData = await req.formData();

  const id = formData.get('category_id') as string;

  const name: {[key: string]: string} = {}
  for ( let lang of myConfig.locale['accept-lang'] ) {
    name[ lang ] = formData.get( `category_name_${ lang }` ) as string;
  }

  const iconFile = formData.get('category_icon') as File | null;
  const icon = iconFile && iconFile.size !== 0 ? Buffer.from( await iconFile.arrayBuffer() ) : null;
  const iconMime = icon ? iconFile!.type : null;

  let iconPath: string | null = null;
  if ( iconFile && icon ) {
    const { filePath, filePathRelative } = await getSavePath( iconFile.name );

    await writeFile( filePath, icon );
    iconPath = filePathRelative;
  }

  const mediaList = await prisma.category.update({
    where: { id: Number( id ) },
    data: iconFile && icon ? {
      name, slug: formData.get('category_slug') as string,
      parent: Number( formData.get('category_parent') as string ),
      rank: Number( formData.get('category_rank') as string ),
      icon: iconPath, icon_mime: iconMime
    } : {
      name, slug: formData.get('category_slug') as string,
      parent: Number( formData.get('category_parent') as string ),
      rank: Number( formData.get('category_rank') as string ),
    }
  });

  return NextResponse.json( mediaList, { status: 200 });
}

export { CategoryUpdate as POST }