'use client';

import { Button } from '@/components/ui/button';
import { RefreshCcw } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from "next/navigation";
import { resetDemo } from '@/app/actions/demo';
import { useState } from 'react';
import LoadingOverlay from '../ui/loading-overlay';

export default function ResetDemoButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleResetDemo() {
    setLoading(true);
    try {
      const result = await resetDemo();
      if (result.success) {
        router.push('/');
      } else {
        toast.error(result.message);
        setLoading(false);
      }
    } catch {
      toast.error('Something went wrong');
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <LoadingOverlay />
    );
  }

  return (
    <Button 
      variant="outline" 
      onClick={handleResetDemo}
      className="flex items-center flex-1 justify-center"
    >
      <RefreshCcw className="h-4 w-4" />
      <span>Reset Demo</span>
    </Button>
  );
}