import "react-loading-skeleton/dist/skeleton.css";
import Skeleton from "react-loading-skeleton";

const getLoadings = (count: number) => {
    let loadings = [];
    
    for (let i = 0; i < count; i++) {
        loadings.push(
            <div
                className="max-w-sm rounded bg-darkgray p-4"
            >
                <div>
                    <Skeleton
                        circle
                        highlightColor="#f58c1b"
                        className="w-full"
                        baseColor="#121212"
                        height={150}
                    />
                    <Skeleton
                        highlightColor="#f58c1b"
                        baseColor="#121212"
                        className="mt-4 mb-1"
                    />
                </div>

                <Skeleton
                    highlightColor="#f58c1b"
                    baseColor="#121212"
                    className="mb-4"
                />
            </div>
        );
    }

    return loadings;
};

export default function UserSectionLoading({
    count = 1,
}: {
    count?: number
}) {

    return (
        <div className="grid lg:grid-cols-5 md:grid-cols-4 grid-cols-2 gap-5">
            {getLoadings(count)}
        </div>
    )
}