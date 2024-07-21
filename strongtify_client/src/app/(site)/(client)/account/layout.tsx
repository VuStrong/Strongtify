import AccountTabs from "@/components/account/AccountTabs";

export default function AccountLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="md:flex py-8 lg:py-0">
            <AccountTabs />
            <div className="p-6 bg-darkgray text-medium text-gray-500 rounded-lg w-full">
                {children}
            </div>
        </div>
    );
}
