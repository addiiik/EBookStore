import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen gap-8 text-center">
      <div className="flex flex-col items-center gap-4">

        <p className="text-sm font-medium tracking-widest uppercase text-muted-foreground">
          404 error
        </p>

        <h1 className="text-5xl font-medium">
          Page not found
        </h1>

        <p className="text-base text-muted-foreground max-w-sm leading-relaxed">
          Sorry, we couldn&apos;t find the page you&apos;re looking for.
        </p>

      </div>
      <Button asChild>
        <Link href="/">Return Home</Link>
      </Button>
    </div>
  )
}