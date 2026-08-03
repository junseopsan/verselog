import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "필사와 변주",
    short_name: "필사와 변주",
    description:
      "매일 좋은 가사를 필사하고 내 문장으로 변주하는 작사 루틴 기록장",
    start_url: "/",
    display: "standalone",
    background_color: "#0c0e13",
    theme_color: "#0c0e13",
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
