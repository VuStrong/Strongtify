"use client";

export default function Error({ reset }: { reset: () => void }) {
    return (
        <section className="grid h-screen pt-32 pb-16">
            <div className="container grid content-center gap-12 lg:max-w-5xl lg:grid-cols-2 lg:items-center">
                <div className="justify-self-center text-center lg:text-left">
                    <h1 className="pb-4 text-5xl font-bold lg:text-6xl text-error">
                        Error !
                    </h1>
                    <p className="pb-8 font-semibold">
                        Oops!, có lỗi gì đó đã xảy ra :(
                    </p>
                    <button
                        onClick={() => reset()}
                        className="mb-2 inline-flex items-center justify-center rounded-full bg-primary py-4 px-8 font-bold text-black"
                    >
                        Thử lại
                    </button>
                    <br />
                    <a
                        href="/"
                        className="inline-flex items-center justify-center rounded-full bg-primary py-4 px-8 font-bold text-black"
                    >
                        Quay về trang chủ
                    </a>
                </div>

                <div className="justify-self-center">
                    <img
                        src="/img/icons/LogoIcon.png"
                        className="w-64 lg:w-[400px]"
                        alt="Strongtify"
                    />
                    <div className="mx-auto h-8 w-36 rounded-[50%] bg-gray-900/30 blur-md lg:w-64"></div>
                </div>
            </div>

            <div className="flex items-center justify-center gap-2 self-end text-sm font-semibold">
                <p>strongtify@gmail.com</p>
            </div>
        </section>
    );
}
