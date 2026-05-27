'use server';

import { prisma } from "@/lib/prisma";
import { CartItemWithBook, WishlistItemWithBook } from "@/types/book";
import { faker } from '@faker-js/faker'
import { getCurrentSession } from "./auth";

export async function getUserAllPurchasedBooks(userId: string) {
  return prisma.purchasedBook.findMany({
    where: { userId },
    include: {
      book: true
    },
    orderBy: {purchasedAt: 'desc'},
  });
}

export async function getUserPurchasedBooks(userId: string) {
  return await prisma.purchasedBook.findMany({
    where: { userId },
    include: {
      book: { select: { id: true } }
    },
  });
}

export async function getUserInfo(userId: string) {
  return prisma.user.findUnique({
    where: {id: userId},
    select: {
      name: true,
      email: true
    }
  })
}

export async function getUserCartItems(userId: string): Promise<CartItemWithBook[]> {
  const purchasedBooks = await getUserPurchasedBooks(userId);
  const purchasedIds = purchasedBooks.map(pb => pb.book.id);

  if (purchasedIds.length > 0) {
    await prisma.cartItem.deleteMany({
      where: {
        userId,
        bookId: { in: purchasedIds }
      }
    });
  }

  return prisma.cartItem.findMany({
    where: { userId },
    include: {
      book: true
    },
    orderBy: {
      book: {
        title: "asc"
      }
    }
  });
}

export async function getUserWishlistItems(userId: string): Promise<WishlistItemWithBook[]> {
  const purchasedBooks = await getUserPurchasedBooks(userId);
  const purchasedIds = purchasedBooks.map(pb => pb.book.id);

  if (purchasedIds.length > 0) {
    await prisma.wishlistItem.deleteMany({
      where: {
        userId,
        bookId: { in: purchasedIds }
      }
    });
  }
  
  return prisma.wishlistItem.findMany({
    where: { userId },
    include: {
      book: true
    },
    orderBy: {
      book: {
        title: 'asc',
      }
    }
  })
}

export async function getUserWishlistCount(userId: string){
  return prisma.wishlistItem.count({
    where: {
      userId: userId,
    },
  });
}

export async function getUserCartItemCount(userId: string) {
  return prisma.cartItem.count({
    where: {
      userId: userId,
    },
  });
}

export async function createUser(): Promise<{ success: boolean; uid: string }> {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();

  const user = await prisma.user.create({
    data: {
      name: firstName,
      email: faker.internet.email({firstName: firstName, lastName: lastName}),
      password: faker.internet.password()
    }
  })

  return { success: true, uid: user.id };
}


export async function removeUser(): Promise<{ success: boolean }> {
  const uid = await getCurrentSession();
  if (!uid) return { success: false };
 
  await prisma.user.delete({
    where: { id: uid },
  });
 
  return { success: true };
}

export async function clearUserData(uid: string): Promise<{ success: boolean }> { 
  await prisma.$transaction([
    prisma.cartItem.deleteMany({ where: { userId: uid } }),
    prisma.wishlistItem.deleteMany({ where: { userId: uid } }),
    prisma.purchasedBook.deleteMany({ where: { userId: uid } }),
    prisma.readingProgress.deleteMany({ where: { userId: uid } }),
  ]);
 
  return { success: true };
}