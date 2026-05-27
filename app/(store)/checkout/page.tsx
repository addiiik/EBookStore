import { getUserCartItems } from "@/app/actions/user";
import { redirect } from "next/navigation";
import Checkout from "./checkout";
import { getCurrentSession } from "@/app/actions/auth";

export default async function CheckoutPage() {
  const uid = await getCurrentSession();
  if (!uid) {
    redirect("/auth/signin");
  }
  const cartItems = await getUserCartItems(uid);

  if (cartItems.length === 0) {
    redirect("/");
  }

  return (
    <Checkout cartItems={cartItems}/>
  );
}