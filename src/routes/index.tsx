import { createFileRoute } from "@tanstack/react-router";
import { SellLaptopHome } from "@/routes/sell.$category";

const homepageTitle = "Sell Old Laptop in Bangalore - Instant Cash | HuluMart";
const homepageDescription =
  "Sell your old or used laptop in Bangalore for instant cash. Get a free instant quote, free doorstep pickup and same-day payment for Apple, Dell, HP, Lenovo and more.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: homepageTitle },
      { name: "description", content: homepageDescription },
      { property: "og:title", content: homepageTitle },
      { property: "og:description", content: homepageDescription },
      { property: "og:url", content: "/" },
      { name: "twitter:title", content: homepageTitle },
      { name: "twitter:description", content: homepageDescription },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: SellLaptopHome,
});
