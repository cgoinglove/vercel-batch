import Link from "next/link";

export default function Header() {
  return (
    <div className="transition-colors hover:bg-white/5 z-50 inset-0 left-0 w-full sticky top-0 border-b">
      <div className="py-4 w-full px-12 max-w-[1000px] mx-auto backdrop-blur-lg">
        <Link href={"/"} className="text-xl text-white font-bold">
          Cgoing<span className="text-orange-500 text-2xl">.</span>
        </Link>
      </div>
    </div>
  );
}
