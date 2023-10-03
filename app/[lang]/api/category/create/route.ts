import { getServerSession } from 'next-auth/next';
import { options } from '@/lib/auth-options';
import type { NextRequest } from 'next/server';
import { NextResponse } from "next/server";
import { PrismaClient, Prisma } from '@prisma/client';
import { writeFile } from 'fs/promises';
import { getSavePath } from '@/lib/functions';

const prisma = new PrismaClient();

async function CategoryCreate( req: NextRequest ) {
  
  const session = await getServerSession( options );
  if ( !session ) return NextResponse.json({ message: 'unauthenticated' }, { status: 401 });

  const formData = await req.formData();
  console.log('create category');

  const iconFile = formData.get('category_icon') as File | null;
  const icon = iconFile && iconFile.size !== 0 ? Buffer.from( await iconFile.arrayBuffer() ) : null;
  const iconMime = icon ? iconFile!.type : null;

  let iconPath: string | null = null;
  if ( iconFile && icon ) {
    const { filePath, filePathRelative } = await getSavePath( iconFile.name );

    await writeFile( filePath, icon );
    iconPath = filePathRelative;
  }

  const mediaList = await prisma.category.create({
    data: {
      name: formData.get('category_name') as string,
      slug: formData.get('category_slug') as string,
      parent: Number( formData.get('category_parent') as string ),
      rank: Number( formData.get('category_rank') as string ),
      icon: iconPath, icon_mime: iconMime
    }
  });

  return NextResponse.json( mediaList, { status: 200 });
}

export { CategoryCreate as POST }