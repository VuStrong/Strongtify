import { ImageResponse } from "next/server";
import { getSongById } from "@/services/api/songs";
import { NO_IMAGE_URL } from "@/libs/constants";

// Route segment config
export const runtime = "edge";

// Image metadata
export const alt = "Song";
export const size = {
    width: 1200,
    height: 1200,
};

// export const contentType = "image/png";

export default async function Image({ params }: { params: { id: string } }) {
    const song = await getSongById(params.id);

    const interSemiBold = fetch(
        new URL(song?.imageUrl ?? NO_IMAGE_URL, import.meta.url),
    ).then((res) => res.arrayBuffer());

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
                
            </div>
        ),
        {
            ...size,
            fonts: [
                {
                    name: "Inter",
                    data: await interSemiBold,
                    style: "normal",
                    weight: 400,
                },
            ],
        },
    );
}
