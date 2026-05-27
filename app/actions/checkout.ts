'use server';

import { prisma } from "@/lib/prisma";
import { getCurrentSession } from "./auth";
import { getUserPurchasedBooks } from "./user";
import { revalidatePath } from "next/cache";

export async function processCheckout(bookIds: string[]){
  const uid = await getCurrentSession();
  if (!uid) {
    return { success: false, message: 'You need to be logged in' }
  }

  const purchasedBooks = await getUserPurchasedBooks(uid);
  const purchasedIds = purchasedBooks.map(pb => pb.book.id);
  const alreadyOwned = bookIds.filter(id => purchasedIds.includes(id));

  if (alreadyOwned.length > 0) {
    return { success: false, message: "You have already purchased one or more of these books" };
  }

  try {
    await prisma.$transaction([
      prisma.purchasedBook.createMany({
        data: bookIds.map((id) => ({
          userId: uid,
          bookId: id
        })),
        skipDuplicates: true,
      }),

      prisma.checkoutSession.create({
        data: {
          userId: uid,
          validUntil: new Date(Date.now() + 1000 * 60 * 2)
        }
      }),

      prisma.cartItem.deleteMany({
        where: {
          userId: uid,
          bookId: { in: bookIds }
        }
      }),

      prisma.wishlistItem.deleteMany({
        where: {
          userId: uid,
          bookId: { in: bookIds }
        }
      })
    ]);

    revalidatePath('/', 'layout');
    return { success: true }
  } catch {
    return { success: false, message: "Unable to complete checkout" };
  }
}

export async function validateCheckoutSession(userId: string) {
  try {
    return await prisma.checkoutSession.findFirst({
      where: {
        userId,
        validUntil: { gte: new Date() }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  } catch {
    return null;
  }
}

export async function deleteCheckoutSession(userId: string) {
  try {
    await prisma.checkoutSession.deleteMany({
      where: { userId }
    });
    return { success: true };
  } catch {
    return { success: false };
  }
}