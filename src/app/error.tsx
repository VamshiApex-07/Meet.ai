"use client";

import Link from "next/link";

interface Props {
  error: Error & { digest?: string };
  reset: () => void;
}

const ErrorPage = ({ reset }: Props) => {
  return (
    <div className="flex h-screen items-center justify-center bg-muted">
      <div className="flex flex-col items-center gap-y-4 text-center">
        <h1 className="text-4xl font-bold">500</h1>
        <p className="text-muted-foreground">Something went wrong</p>
        <div className="flex gap-x-4">
          <button
            onClick={reset}
            className="text-sm underline underline-offset-4 hover:text-primary"
          >
            Try again
          </button>
          <Link
            href="/"
            className="text-sm underline underline-offset-4 hover:text-primary"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
