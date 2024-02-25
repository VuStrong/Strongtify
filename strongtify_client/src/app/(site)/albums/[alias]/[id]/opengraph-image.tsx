import { NO_IMAGE_URL } from "@/libs/constants";
import { getAlbumById } from "@/services/api/albums";
import { ImageResponse } from "next/server";

// Route segment config
export const runtime = "edge";

// Image metadata
export const alt = "Album";
export const size = {
    width: 1200,
    height: 1200,
};

// export const contentType = "image/png";

export default async function Image({ params }: { params: { id: string } }) {
    const album = await getAlbumById(params.id);

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
                    src={album?.imageUrl ?? NO_IMAGE_URL}
                    alt={album?.name}
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
