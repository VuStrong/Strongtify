import "react-loading-skeleton/dist/skeleton.css";
import Skeleton from "react-loading-skeleton";

export default function SiteLoading() {
    return (
        <div className="w-full h-full flex flex-col gap-20 mt-5">
            <Skeleton
                highlightColor="#f58c1b"
                baseColor="#121212"
            />
        </div>
    );
}
