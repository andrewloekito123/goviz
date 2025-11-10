"use client";

import { div } from "framer-motion/client";
import Beams from "./Beams";
// (or depending on export path: "reactbits/dist/backgrounds/beams" — check your version)
export default function BeamsWrapper() {
  return (
    <div className="absolute inset-0">
      <Beams
        beamWidth={2}
        beamHeight={15}
        beamNumber={12}
        lightColor="#032bff"
        speed={2}
        noiseIntensity={1.75}
        scale={0.2}
        rotation={0}
      />
    </div>
  );
}
