"use client";

import { useEffect, useState } from "react";

export default function Loader() {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setHidden(true), 1400);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className={`goviz-loader${hidden ? " out" : ""}`}>
      <div className="goviz-loader-word">GOVIZ</div>
    </div>
  );
}
