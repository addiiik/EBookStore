'use server';

import { prisma } from '@/lib/prisma';
import { getCurrentSession } from './auth';

export async function getReadingProgress(userId: string, bookId: string) {
  return prisma.readingProgress.findUnique({
    where: {
      userId_bookId: {
        userId: userId,
        bookId,
      },
    },
  });
}

export async function createReadingProgress(userId: string, bookId: string) {
  return prisma.readingProgress.create({
    data: {
      userId: userId,
      bookId,
      page: 1,
      finished: false,
    },
  });
}

export async function checkReadingProgress(userId: string, bookId: string) {
  let progress = await getReadingProgress(userId, bookId);

  if (!progress) {
    progress = await createReadingProgress(userId, bookId);
  }

  return progress;
}

export async function updateReadingProgress(bookId: string, page: number) {
  const uid = await getCurrentSession();
  if (!uid) {
    return { success: false, message: 'You need to be logged in' };
  }

  const safePage = Math.max(1, page);

  try {
    await prisma.readingProgress.update({
      where: {
        userId_bookId: {
          userId: uid,
          bookId,
        },
      },
      data: {
        page: safePage,
      },
    });

    return { success: true, message: 'Progress updated' };
  } catch  {
    return { success: false, message: 'Could not update progress' };
  }
}

export async function resetReadingProgress(bookId: string) {
  const uid = await getCurrentSession();
  if (!uid) {
    return { success: false, message: 'You need to be logged in' };
  }

  try {
    await prisma.readingProgress.update({
      where: {
        userId_bookId: {
          userId: uid,
          bookId,
        },
      },
      data: {
        page: 1,
        finished: false,
      },
    });

    return { success: true, message: 'Progress reset' };
  } catch {
    return { success: false, message: 'Could not reset progress' };
  }
}

export async function getUserReadingProgresses(userId: string) {
  return await prisma.readingProgress.findMany({
    where: {
      userId: userId,
    },
    include: {
      book: {
        select: {
          id: true,
        },
      },
    },
    orderBy: {
      updatedAt: 'desc',
    },
  });
}

export async function finishBook(bookId: string) {
  const uid = await getCurrentSession();
  if (!uid) {
    return { success: false, message: 'You need to be logged in' };
  }

  try {
    await prisma.readingProgress.update({
      where: {
        userId_bookId: {
          userId: uid,
          bookId,
        },
      },
      data: {
        finished: true,
      },
    });

    return { success: true, message: 'Book finished' };
  } catch {
    return { success: false, message: 'Could not mark book as finished' };
  }
}