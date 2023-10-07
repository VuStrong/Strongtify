import Image from "next/image";

export default async function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <section>
            {/* Header */}
            <header className="bg-black p-3">
                <a href="/" className="w-[100px] block">
                    <Image
                        src="/img/icons/LogoIcon.png"
                        width={100}
                        height={50}
                        alt="Strongtify"
                    />
                </a>
            </header>

            <div className="text-yellow-50 justify-center flex inset-0 z-50 min-h-screen bg-logo-1 bg-no-repeat bg-cover bg-center">
                <div className="relative w-11/12 md:w-4/6 lg:w-3/6 xl:w-2/5 my-6 mx-auto h-5/6 lg:h-auto md:h-auto">
                    <div className="h-full">{children}</div>
                </div>
            </div>
        </section>
    );
}
