import { Genre } from "@/types/genre";
import GenreItem from "./GenreItem";

export default function GenreSection({ genres }: { genres: Genre[] }) {
    return (
        <section
            className={`grid md:grid-cols-4 lg:grid-cols-5 grid-cols-2 sm:gap-6 gap-3`}
        >
            {genres?.length === 0 && (
                <div className="text-gray-500">Không có kết quả</div>
            )}

            {genres?.map((genre) => <GenreItem key={genre.id} genre={genre} />)}
        </section>
    );
}
