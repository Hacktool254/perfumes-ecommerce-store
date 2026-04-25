import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Ummie's Essence | Luxury Perfumes & Cosmetics Kenya";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
    return new ImageResponse(
        (
            <div
                style={{
                    background: "#0a0a0b",
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "serif",
                    position: "relative",
                    overflow: "hidden",
                }}
            >
                {/* Gradient orb */}
                <div
                    style={{
                        position: "absolute",
                        width: 600,
                        height: 600,
                        borderRadius: "50%",
                        background: "radial-gradient(circle, rgba(176,125,91,0.25) 0%, transparent 70%)",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        display: "flex",
                    }}
                />

                {/* Brand name */}
                <div
                    style={{
                        fontSize: 72,
                        fontWeight: 700,
                        color: "#e8d5c4",
                        letterSpacing: "0.05em",
                        marginBottom: 16,
                        display: "flex",
                    }}
                >
                    Ummie&apos;s Essence
                </div>

                {/* Tagline */}
                <div
                    style={{
                        fontSize: 28,
                        color: "#B07D5B",
                        letterSpacing: "0.2em",
                        textTransform: "uppercase",
                        marginBottom: 40,
                        display: "flex",
                    }}
                >
                    Luxury Perfumes &amp; Cosmetics · Kenya
                </div>

                {/* Divider */}
                <div
                    style={{
                        width: 120,
                        height: 1,
                        background: "rgba(176,125,91,0.5)",
                        marginBottom: 40,
                        display: "flex",
                    }}
                />

                {/* URL */}
                <div
                    style={{
                        fontSize: 20,
                        color: "rgba(232,213,196,0.5)",
                        letterSpacing: "0.1em",
                        display: "flex",
                    }}
                >
                    ummieessence.store
                </div>
            </div>
        ),
        { ...size }
    );
}
