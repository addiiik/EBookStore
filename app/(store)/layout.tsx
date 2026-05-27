import { NavbarServer } from "@/components/navigation/navbarServer";

export default function StoreLayout({ children }: Readonly<{children: React.ReactNode;}>) {
  return (
    <div>
      <NavbarServer />
      <main className="min-h-screen">
        {children}
      </main>
    </div>
  );
}