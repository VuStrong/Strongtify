import { NO_IMAGE_URL } from "@/libs/constants";
import { getPlaylistById } from "@/services/api/playlists";
import { ImageResponse } from "next/server";

// Route segment config
export const runtime = "edge";

// Image metadata
export const alt = "Playlist";
export const size = {
    width: 1200,
    height: 1200,
};

// export const contentType = "image/png";

export default async function Image({ params }: { params: { id: string } }) {
    const playlist = await getPlaylistById(params.id);

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
                    src={playlist?.imageUrl ?? NO_IMAGE_URL}
                    alt={playlist?.name}
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
