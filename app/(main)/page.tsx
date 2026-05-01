import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

import professorImage from "@/public/images/professorlogo.png"

export default function Home() {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="flex flex-col gap-4 border-2 border-gray-300 rounded-md p-4">
        <header className="flex flex-col gap-4">

          <section className="flex justify-between items-center">
            <Image src={professorImage} alt="Professor Logo" width={100} height={100} />
            <h1 className="font-black text-5xl tracking-tight">ProfRater</h1>
          </section>
          <p className="text-sm text-gray-500 font-medium">Rate your professors and get personalized feedback.</p>
        </header>

        <main className="flex gap-4 items-center justify-center">
          <Link href="/auth/login">
            <Button className="w-full text-lg px-4 py-2 font-bold">
              <span>Login</span>
            </Button>
          </Link>
          <Link href="/auth/sign-up">
            <Button variant="outline" className="w-full text-lg px-4 py-2 font-bold">
              <span>Signup</span>
            </Button>
          </Link>
        </main>
        
      </div>
    </div>
  );
}
