import "react-loading-skeleton/dist/skeleton.css";
import Skeleton from "react-loading-skeleton";

export default function AdminLoading() {
    return (
        <div className="w-full h-full">
            <Skeleton highlightColor="#f58c1b" baseColor="#121212" />
        </div>
    );
}
