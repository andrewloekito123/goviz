// MasonryWrapper.tsx
"use client";

import Masonry from "@/components/Masonry";

const items = [
  {
    id: "1",
    img: "https://picsum.photos/id/1015/600/900?grayscale",
    url: "#",
    height: 400,
  },
  {
    id: "2",
    img: "https://picsum.photos/id/1011/600/750?grayscale",
    url: "#",
    height: 250,
  },
  {
    id: "3",
    img: "https://picsum.photos/id/1020/600/800?grayscale",
    url: "#",
    height: 600,
  },
  {
    id: "4",
    img: "https://picsum.photos/id/1035/600/700",
    url: "#",
    height: 300,
  },
  {
    id: "5",
    img: "https://picsum.photos/id/1042/600/650",
    url: "#",
    height: 350,
  },
  {
    id: "6",
    img: "https://picsum.photos/id/1015/600/900?grayscale",
    url: "#",
    height: 400,
  },
  {
    id: "7",
    img: "https://picsum.photos/id/1011/600/750?grayscale",
    url: "#",
    height: 250,
  },
  {
    id: "8",
    img: "https://picsum.photos/id/1020/600/800?grayscale",
    url: "#",
    height: 600,
  },
  {
    id: "9",
    img: "https://picsum.photos/id/1035/600/700",
    url: "#",
    height: 300,
  },
  {
    id: "10",
    img: "https://picsum.photos/id/1042/600/650",
    url: "#",
    height: 350,
  },
];

export default function MasonryWrapper() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
        Masonry Grid
      </h2>

      {/* Relative container ensures absolute children are positioned correctly */}
      <div className="relative w-full min-h-[600px]">
        <Masonry
          items={items}
          ease="power3.out"
          duration={0.6}
          stagger={0.05}
          animateFrom="bottom"
          scaleOnHover={true}
          hoverScale={1.05}
          blurToFocus={true}
          colorShiftOnHover={true}
        />
      </div>
    </div>
  );
}
