'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from "sonner";
import { restartDemo } from '@/app/actions/demo';

export default function ErrorClient() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleRestartDemo() {
    setLoading(true);
    try {
      const result = await restartDemo();
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
      <div className="fixed inset-0 bg-background flex items-center justify-center">
        <Loader2 className="animate-spin" size={32} />
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-center items-center min-h-screen gap-8 text-center">
      <div className="flex flex-col items-center gap-4">

        <p className="text-sm font-medium tracking-widest uppercase text-muted-foreground">
          Unexpected error
        </p>

        <h1 className="text-5xl font-medium">
          Something went terribly wrong
        </h1>

        <p className="text-base text-muted-foreground max-w-sm leading-relaxed">
          An unexpected error occurred and the application wasn&apos;t able to continue.
          You can restart the demo to get back on track.
        </p>

        <Button
          onClick={handleRestartDemo}
        >
          Restart demo
        </Button>
      </div>
    </div>
  );
}