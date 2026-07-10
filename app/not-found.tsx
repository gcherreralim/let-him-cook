import Link from "next/link";

export default function NotFound() {
  return (
    <main className="grid min-h-dvh place-items-center px-5 text-center">
      <div>
        <p className="font-hand text-6xl text-tomato">404</p>
        <h1 className="mt-2 font-serif2 text-2xl font-semibold">That page isn&apos;t in the book</h1>
        <p className="mt-1 text-sm font-semibold text-inksoft">It may have been torn out, or the link is wrong.</p>
        <Link href="/" className="btn-tomato mt-6">Back to the cookbook</Link>
      </div>
    </main>
  );
}
