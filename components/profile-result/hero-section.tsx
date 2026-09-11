import { BrandMark } from "./shared";

export function HeroSection() {
  return (
    <div className="flex flex-col items-center gap-3 pt-4 text-center">
      <BrandMark />
      <h1 className="text-2xl font-extrabold leading-tight text-white sm:text-3xl">
        A maior ferramenta <br className="sm:hidden" />
        de <span className="text-violet-400">Stalker</span> do Brasil
      </h1>
    </div>
  );
}
