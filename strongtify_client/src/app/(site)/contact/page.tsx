import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Contact | Strongtify",
};

export default async function Contact() {
    return (
        <section className="bg-white rounded-lg p-5">
            <h1 className="text-black text-3xl font-semibold mb-5">Liên hệ</h1>

            <div className="flex flex-col gap-5">
                <p className="text-gray-600">
                    Mọi thông tin tư vấn, hỗ trợ vui lòng gửi về Email:
                    strongtify@gmail.com
                </p>
            </div>
        </section>
    );
}
