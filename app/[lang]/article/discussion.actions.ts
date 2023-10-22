'use server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function createNewComment(formData: FormData) {
  
  /*await new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    }, 3000);
  });*/

  const result = await prisma.user.findFirst({ where: { id: 1 } });

  return { message: result };
}