import "react-loading-skeleton/dist/skeleton.css";
import Skeleton from "react-loading-skeleton";

export default function SiteLoading() {
    return (
        <div className="w-full h-full flex flex-col gap-10">
            <div className="grid lg:grid-cols-5 md:grid-cols-4 grid-cols-2 gap-5">
                <Skeleton
                    highlightColor="#f58c1b"
                    baseColor="#121212"
                    height={200}
                />
                <Skeleton
                    highlightColor="#f58c1b"
                    baseColor="#121212"
                    height={200}
                />
                <Skeleton
                    highlightColor="#f58c1b"
                    baseColor="#121212"
                    height={200}
                />
                <Skeleton
                    highlightColor="#f58c1b"
                    baseColor="#121212"
                    height={200}
                />
                <Skeleton
                    highlightColor="#f58c1b"
                    baseColor="#121212"
                    height={200}
                />
            </div>

            <div className="grid lg:grid-cols-5 md:grid-cols-4 grid-cols-2 gap-5">
                <Skeleton
                    highlightColor="#f58c1b"
                    baseColor="#121212"
                    height={200}
                />
                <Skeleton
                    highlightColor="#f58c1b"
                    baseColor="#121212"
                    height={200}
                />
                <Skeleton
                    highlightColor="#f58c1b"
                    baseColor="#121212"
                    height={200}
                />
                <Skeleton
                    highlightColor="#f58c1b"
                    baseColor="#121212"
                    height={200}
                />
                <Skeleton
                    highlightColor="#f58c1b"
                    baseColor="#121212"
                    height={200}
                />
            </div>

            <div className="grid lg:grid-cols-5 md:grid-cols-4 grid-cols-2 gap-5">
                <Skeleton
                    highlightColor="#f58c1b"
                    baseColor="#121212"
                    height={200}
                />
                <Skeleton
                    highlightColor="#f58c1b"
                    baseColor="#121212"
                    height={200}
                />
                <Skeleton
                    highlightColor="#f58c1b"
                    baseColor="#121212"
                    height={200}
                />
                <Skeleton
                    highlightColor="#f58c1b"
                    baseColor="#121212"
                    height={200}
                />
                <Skeleton
                    highlightColor="#f58c1b"
                    baseColor="#121212"
                    height={200}
                />
            </div>
        </div>
    );
}
