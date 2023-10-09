import { ImageResponse } from "next/server";

// Route segment config
export const runtime = "edge";

// Image metadata
export const alt = "About Acme";
export const size = {
    width: 1200,
    height: 630,
};

export const contentType = "image/png";

export default async function Image({ params }: { params: { id: string } }) {
    const interSemiBold = fetch(
        new URL("./Inter-SemiBold.ttf", import.meta.url),
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
                About Acme
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
