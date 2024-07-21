import CreatePlaylistModal from "@/components/modals/globals/CreatePlaylistModal";
import ClientSideBar from "@/components/sideBars/ClientSideBar";

export default async function ClientSiteLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <CreatePlaylistModal />
            <ClientSideBar />

            <div className="w-full lg:w-10/12 lg:px-5 px-2 lg:ml-auto mt-10 lg:mt-0">
                {children}
            </div>
        </>
    );
}
