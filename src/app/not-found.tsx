import Link from "next/link";

const NotFoundPage = () => {
  return (
    <div className="flex h-screen items-center justify-center bg-muted">
      <div className="flex flex-col items-center gap-y-4 text-center">
        <h1 className="text-4xl font-bold">404</h1>
        <p className="text-muted-foreground">Page not found</p>
        <Link
          href="/"
          className="text-sm underline underline-offset-4 hover:text-primary"
        >
          Go home
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
