import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "SohojExam - Smart Exam Preparation",
    short_name: "SohojExam",
    description: "Previous question papers and focused exam preparation.",
    start_url: "/",
    display: "standalone",
    background_color: "#f7f8fc",
    theme_color: "#6849f4",
    icons: [{ src: "/favicon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}