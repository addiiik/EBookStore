'use client';

import { removeUserSession } from '@/app/actions/auth';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from "next/navigation";
interface SignOutButtonProps {
  demo: boolean;
}
export default function SignOutButton({demo}: SignOutButtonProps) {
  const router = useRouter();
  async function handleSignOut() {
    try {
      const result = await removeUserSession();
      if (result.success) {
        if (!demo) toast.success(result.message);
        router.refresh();
      }
      else {
        if (!demo) toast.error(result.message);
      }
    } catch {
      if (!demo) toast.error("Something went wrong");
    }
  };
  return (
    <Button 
      variant="outline" 
      onClick={handleSignOut}
      className="flex items-center flex-1 justify-center"
    >
      <LogOut className="h-4 w-4" />
      <span>{demo ? "Exit Demo" : "Sign Out"}</span>
    </Button>
  );
}