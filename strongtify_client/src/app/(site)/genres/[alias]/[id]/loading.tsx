import "react-loading-skeleton/dist/skeleton.css";
import Skeleton from "react-loading-skeleton";
import PlaylistSectionLoading from "@/components/loadings/PlaylistLoadingSection";
import SongSectionLoading from "@/components/loadings/SongSectionLoading";

export default function GenreDetailLoading() {
    return (
        <div className="w-full h-full flex flex-col gap-20 mt-5">
            <Skeleton
                className="h-[200px] sm:h-[350px] w-full"
                highlightColor="#f58c1b"
                baseColor="#121212"
            />

            <SongSectionLoading count={10} />

            <PlaylistSectionLoading count={5} />
        </div>
    );
}
