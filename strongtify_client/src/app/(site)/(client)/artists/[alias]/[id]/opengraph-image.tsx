import { ImageResponse } from "next/server";
import { DEFAULT_AVATAR_URL } from "@/libs/constants";
import { getArtistById } from "@/services/api/artists";

// Route segment config
export const runtime = "edge";

// Image metadata
export const alt = "Artist";
export const size = {
    width: 1200,
    height: 1200,
};

// export const contentType = "image/png";

export default async function Image({ params }: { params: { id: string } }) {
    const artist = await getArtistById(params.id);

    return new ImageResponse(
        (
            <div
                style={{
                    fontSize: 128,
                    background: "white",
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <img
                    src={artist?.imageUrl ?? DEFAULT_AVATAR_URL}
                    alt={artist?.name}
                    style={{
                        width: "100%",
                        height: "100%",
                    }}
                />
            </div>
        ),
        {
            ...size,
        },
    );
}
