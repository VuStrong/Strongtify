"use client";

export default function Modal({
    children,
    actionButton,
    isOpen,
    onClickClose,
}: {
    children: React.ReactNode;
    actionButton?: React.ReactNode;
    isOpen: boolean;
    onClickClose: () => void;
}) {
    return (
        <section className={`relative z-50 ${!isOpen && "hidden"}`}>
            <div className="fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity w-screen h-full"></div>
            <div
                className="fixed inset-0 z-50 w-screen overflow-y-auto"
                onClick={onClickClose}
            >
                <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="transform overflow-hidden rounded-lg bg-black text-left shadow-xl transition-all sm:my-8 w-full sm:max-w-lg"
                    >
                        {children}

                        <div className="bg-black px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                            {actionButton}

                            <button
                                onClick={onClickClose}
                                type="button"
                                className="mt-3 inline-flex w-full justify-center rounded-md bg-darkgray px-3 py-2 text-sm font-semibold text-yellow-50 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-black sm:mt-0 sm:w-auto"
                            >
                                Đóng
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
