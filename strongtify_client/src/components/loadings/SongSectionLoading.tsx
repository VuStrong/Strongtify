import "react-loading-skeleton/dist/skeleton.css";
import Skeleton from "react-loading-skeleton";

const getLoadings = (count: number) => {
    let loadings = [];
    
    for (let i = 0; i < count; i++) {
        loadings.push(
            <div className="flex gap-x-3 items-center w-full p-2">
                <Skeleton
                    highlightColor="#f58c1b"
                    baseColor="#121212"
                    height={50}
                    width={50}
                />

                <div className="flex-1 truncate">
                    <Skeleton
                        highlightColor="#f58c1b"
                        baseColor="#121212"
                    />
                    <Skeleton
                        highlightColor="#f58c1b"
                        baseColor="#121212"
                        width={100}
                    />
                </div>
            </div>
        );
    }

    return loadings;
};

export default function SongSectionLoading({
    count = 1,
    oneColumn
}: {
    count?: number
    oneColumn?: boolean
}) {

    return (
        <div className={`grid sm:gap-3 gap-1 grid-cols-1 ${
                !oneColumn && "md:grid-cols-2 lg:grid-cols-3"
            }`}
        >
            {getLoadings(count)}
        </div>
    )
}