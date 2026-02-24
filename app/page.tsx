import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Projects from "@/components/sections/Projects";
import TechStack from "@/components/sections/TechStack";
import Experience from "@/components/sections/Experience";
import GetInTouch from "@/components/sections/GetInTouch";

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <Projects />
      <TechStack />
      <Experience />
      <GetInTouch />
    </>
  );
}
