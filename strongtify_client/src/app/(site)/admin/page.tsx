import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
    title: "Admin Dashboard",
};

export default function AdminPage() {
    return (
        <section className="text-white">
            <h1 className="text-primary text-3xl mb-5">
                Trang này đang trong quá trình xây dựng
            </h1>

            <Image
                src={"/img/under-construction.jpg"}
                width={1000}
                height={500}
                className="w-full md:h-[500px] object-cover"
                alt="img"
            />
        </section>
    );
}
