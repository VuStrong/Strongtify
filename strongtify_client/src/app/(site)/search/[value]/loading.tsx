import PlaylistSectionLoading from "@/components/loadings/PlaylistLoadingSection";
import SongSectionLoading from "@/components/loadings/SongSectionLoading";

export default function SearchValueLoading() {
    return (
        <div className="w-full h-full flex flex-col gap-10">
            <SongSectionLoading count={5} />
            <PlaylistSectionLoading count={5} />
            <PlaylistSectionLoading count={5} />
        </div>
    );
}
