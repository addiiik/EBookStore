import { getCurrentSession } from "@/app/actions/auth";
import { Navbar } from "./navbarClient";
import { getUserCartItemCount, getUserWishlistCount } from "@/app/actions/user";

export async function NavbarServer() {
  const uid = await getCurrentSession();

  const [wishlistCount, cartItemsCount] = uid
    ? await Promise.all([
        getUserWishlistCount(uid),
        getUserCartItemCount(uid),
      ])
    : [0, 0];

  return <Navbar wishlistCount={wishlistCount} cartItemsCount={cartItemsCount} />;
}