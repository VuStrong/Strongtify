import SongSectionLoading from "@/components/loadings/SongSectionLoading";
import PlaylistSectionLoading from "@/components/loadings/PlaylistLoadingSection";

export default function CollectionLoading() {
    return (
        <div className="w-full h-full flex flex-col gap-20 mt-5">
            <PlaylistSectionLoading count={5} />

            <SongSectionLoading count={10} />

            <PlaylistSectionLoading count={5} />
        </div>
    );
}
