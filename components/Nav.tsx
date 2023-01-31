import { Share } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";

export default function Nav() {
  return (
    <nav className="fixed h-16 flex animate-fade-in-down backdrop-blur-lg flex-row justify-between items-center px-4 left-2 right-2 md:left-6 md:right-6 lg:left-12 lg:right-12 top-4 py-3 bg-blue-900/10 border-zinc-500/10 border-4 rounded-2xl shadow-md z-20">
      <div className="flex flex-row gap-3 items-center group">
        <Link href="/" className="flex flex-row gap-2 select-none">
          <div className="relative w-[32px] h-[32px]">
            <Image src="/Logo.svg" alt="Buildergroop" fill />
          </div>
        </Link>
        <div className="flex flex-row items-baseline gap-2 select-none">
          <Link href="/" className="flex flex-row gap-2">
            <h1 className="text-xl text-white font-krona">BuilderWorks</h1>
          </Link>
          <h3 className="text-lg font-urbanist font-semibold text-zinc-400">
            a{" "}
            <a
              href="https://discord.gg/builders"
              className="bg-clip-text transition-all text-transparent bg-gradient-to-tr from-blue-800 via-purple-800 to-orange-500"
            >
              buildergroop
            </a>{" "}
            project
          </h3>
        </div>
      </div>

      <div className="flex flex-row gap-4 items-center">
        <Link
          href="https://discord.gg/builders"
          className="px-4 py-1 hover:-translate-y-0.5 rounded-lg shadow-xl hover:shadow-purple-800/50 active:shadow-sm bg-blue-800/50 hover:bg-blue-800/80 transition-all duration-500 text-white font-urbanist font-semibold"
        >
          start building
        </Link>
      </div>
    </nav>
  );
}
