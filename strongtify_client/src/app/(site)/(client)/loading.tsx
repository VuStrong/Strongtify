import { ClipLoader } from "react-spinners";

export default function SiteLoading() {
    return (
        <div className="w-full h-screen flex justify-center items-center">
            <ClipLoader color="#f58c1b" />
        </div>
    );
}
