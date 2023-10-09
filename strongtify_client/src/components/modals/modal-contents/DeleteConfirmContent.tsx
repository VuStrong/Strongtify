"use client";

export default function DeleteConfirmContent({
    title,
    body,
}: {
    title: string;
    body: React.ReactNode;
}) {
    return (
        <div className="bg-black px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
                <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                    <h3 className="text-base font-semibold leading-6 text-yellow-50">
                        {title}
                    </h3>
                    <div className="mt-2">
                        <p className="text-sm text-gray-500">{body}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
