const { PrismaClient } = require('@prisma/client');

async function findUserByNameIdAndPassword(nameid, password) {
  const prisma = new PrismaClient();

  try {
    const user = await prisma.user.findFirst({
      where: {
        nameid,
        password,
      },
    });

    return user;
  } catch (error) {
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// 使用例
const nameidToSearch = 'ryuki';
const passwordToSearch = 'ymzkrk33';

findUserByNameIdAndPassword(nameidToSearch, passwordToSearch)
  .then((user) => {
    if (user) {
      console.log('ユーザーが見つかりました:', user);
    } else {
      console.log('該当するユーザーが見つかりませんでした。');
    }
  })
  .catch((error) => {
    console.error('エラー:', error);
  });
