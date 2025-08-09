import Image from "next/image";

export default function Home() {
  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />
        </main>
      <div className="flex flex-col gap-4 items-center justify-center">
        <h1 className="text-4xl font-bold">Welcome to Next.js!</h1>
        <p className="text-lg text-gray-600">This is a simple starter template.</p>
      </div>
      <footer className="text-sm text-gray-500">
        © {new Date().getFullYear()} Your Company
      </footer>
    </div>
  );
}
