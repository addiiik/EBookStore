'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { startDemo } from '@/app/actions/demo';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import LoadingOverlay from '@/components/ui/loading-overlay';

export default function DemoClient() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function beginDemo() {
    setLoading(true);
    try {
      const result = await startDemo();
      if (result.success) {
        router.push('/');
        return;
      } else {
        setLoading(false);
        toast.error(result.message);
      }
    } catch {
      toast.error('Something went wrong. Please refresh and try again.');
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <LoadingOverlay />
    );
  }

  return (
    <div className="flex flex-col justify-center items-center min-h-screen">
      <Button onClick={beginDemo}>
        Continue to demo
      </Button>
    </div>
  );
}