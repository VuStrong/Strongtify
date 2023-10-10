import { ImageResponse } from "next/server";
import { DEFAULT_AVATAR_URL } from "@/libs/constants";
import { getUserById } from "@/services/api/users";

// Route segment config
export const runtime = "edge";

// Image metadata
export const alt = "User";
export const size = {
    width: 1200,
    height: 1200,
};

// export const contentType = "image/png";

export default async function Image({ params }: { params: { id: string } }) {
    const user = await getUserById(params.id);

    const interSemiBold = fetch(
        new URL(user?.imageUrl ?? DEFAULT_AVATAR_URL, import.meta.url),
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