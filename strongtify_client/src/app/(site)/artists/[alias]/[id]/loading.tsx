import "react-loading-skeleton/dist/skeleton.css";
import Skeleton from "react-loading-skeleton";

export default function ArtistDetailLoading() {
    return (
        <div className="bg-darkgray rounded-lg p-10">
            <div className="w-full lg:max-w-full md:flex mb-5">
                <div className="w-full md:w-[150px] h-[150px]">
                    <Skeleton
                        circle
                        highlightColor="#f58c1b"
                        baseColor="#121212"
                        height={150}
                    />
                </div>

                <div className="p-4 flex flex-col justify-between leading-normal">
                    <div className="md:mb-3">
                        <Skeleton
                            highlightColor="#f58c1b"
                            baseColor="#121212"
                            count={4}
                        />
                    </div>
                </div>
            </div>

            <Skeleton
                highlightColor="#f58c1b"
                baseColor="#121212"
                count={5}
            />
        </div>
    );
}
