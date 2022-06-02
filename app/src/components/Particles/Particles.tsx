import ReactParticles from "react-tsparticles";
import { loadFull } from "tsparticles";
import parallax from "./variants/parallax.json";

export const Particles = (): JSX.Element => {
  // @ts-ignore
  return <ReactParticles init={loadFull} options={parallax} />;
};
