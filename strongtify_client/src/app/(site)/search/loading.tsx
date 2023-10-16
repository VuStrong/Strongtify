import "react-loading-skeleton/dist/skeleton.css";
import Skeleton from "react-loading-skeleton";

const getLoadings = () => {
    let loadings = [];
    
    for (let i = 0; i < 20; i++) {
        loadings.push(
            <Skeleton
                highlightColor="#f58c1b"
                baseColor="#121212"
                height={100}
            />
        );
    }

    return loadings;
};

export default function SearchPageLoading() {
    return (
        <div className="w-full h-full mt-10">
            <div className="grid lg:grid-cols-5 md:grid-cols-4 grid-cols-2 gap-3">
                {getLoadings()}
            </div>
        </div>
    )
}