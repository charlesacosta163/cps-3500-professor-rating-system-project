import Image from "next/image";
import professorImage from "@/public/images/professorlogo.png"
import { LogoutButton } from "@/components/logout-button";

export default function RootLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    return (
      <div className="flex flex-col items-center">
        <header className="flex justify-between items-center max-w-[800px] w-full border border-blue-400">
            
            <section className="flex items-center">
                <Image src={professorImage} alt="Professor Logo" width={40} height={40} />
                <h1 className="font-black text-lg tracking-tight">ProfRater</h1>
            </section>

            <LogoutButton />
        </header>

        <main className="flex flex-col items-center max-w-[800px] w-full border">
            {children}
        </main>
      </div>
    );
  }
  