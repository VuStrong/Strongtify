import SongSectionLoading from "@/components/loadings/SongSectionLoading";

export default function RankLoading() {
    return (
        <div className="w-full h-full mt-5">
            <SongSectionLoading oneColumn count={10} />
        </div>
    );
}
