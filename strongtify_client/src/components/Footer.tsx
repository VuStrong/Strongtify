import Link from "next/link";

export default function Footer() {
    return (
        <footer className="pt-10 pb-28">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 mb-10">
                <div>
                    <p className="text-yellow-50 text-lg font-medium mb-2">
                        Thông tin
                    </p>
                    <ul className="text-gray-400 flex flex-col gap-2">
                        <li>
                            <a
                                href={`${process.env.BACKEND_URL}/api`}
                                className="hover:text-primary"
                                target="_blank"
                            >
                                Strongtify API
                            </a>
                        </li>
                        <li>
                            <Link
                                href="/privacy"
                                className="hover:text-primary"
                            >
                                Chính sách riêng tư
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/license"
                                className="hover:text-primary"
                            >
                                Khiếu nại bản quyền
                            </Link>
                        </li>
                    </ul>
                </div>

                <div>
                    <p className="text-yellow-50 text-lg font-medium mb-2">
                        Sites
                    </p>
                    <ul className="text-gray-400 flex flex-col gap-2">
                        <li>
                            <a
                                href="https://phimstrong.azurewebsites.net"
                                className="hover:text-primary"
                                target="_blank"
                            >
                                PhimStrong
                            </a>
                        </li>
                        <li>
                            <a
                                href="https://github.com/VuManh1"
                                className="hover:text-primary"
                                target="_blank"
                            >
                                Github
                            </a>
                        </li>
                    </ul>
                </div>

                <div>
                    <p className="text-yellow-50 text-lg font-medium mb-2">
                        Trợ giúp
                    </p>
                    <ul className="text-gray-400 flex flex-col gap-2">
                        <li>
                            <Link
                                href="/contact"
                                className="hover:text-primary"
                            >
                                Liên hệ
                            </Link>
                        </li>
                        <li>
                            <a href="#" className="hover:text-primary">
                                Hỏi đáp
                            </a>
                        </li>
                        <li>
                            <a href="#" className="hover:text-primary">
                                Tin tức
                            </a>
                        </li>
                    </ul>
                </div>
            </div>

            <div>
                <p className="text-gray-400">&copy; 2023 - Strongtify</p>
            </div>
        </footer>
    );
}
