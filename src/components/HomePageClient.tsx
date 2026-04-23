"use client";

import { useCallback, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import type {
  ProjectRow,
  ServiceRow,
  SiteSettingsRow,
} from "@/lib/supabase/types";
import { initGsapScroll } from "@/lib/gsapInit";
import Loader from "@/components/Loader";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Projects from "@/components/Projects";
import About from "@/components/About";
import Team from "@/components/Team";
import Services from "@/components/Services";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import ProjectDetail from "@/components/ProjectDetail";

const Viewer3D = dynamic(() => import("@/components/Viewer3D"), {
  ssr: false,
});

const SECTION_IDS = [
  "hero",
  "projects",
  "about",
  "team",
  "services",
  "contact",
] as const;

type Props = {
  projects: ProjectRow[];
  services: ServiceRow[];
  settings: SiteSettingsRow | null;
};

export default function HomePageClient({
  projects,
  services,
  settings,
}: Props) {
  const [selectedProject, setSelectedProject] = useState<ProjectRow | null>(
    null,
  );
  const [viewerProject, setViewerProject] = useState<ProjectRow | null>(null);
  const [activeSection, setActiveSection] = useState<string>("hero");

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActiveSection(e.target.id);
        });
      },
      { threshold: 0.35 },
    );
    SECTION_IDS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const cleanupRef: {
      dispose?: () => void;
      timer?: ReturnType<typeof setTimeout>;
    } = {};
    const check = () => {
      if (document.querySelectorAll("#projects .reveal").length > 0) {
        cleanupRef.dispose = initGsapScroll();
      } else {
        cleanupRef.timer = setTimeout(check, 120);
      }
    };
    const raf = requestAnimationFrame(check);
    return () => {
      cancelAnimationFrame(raf);
      if (cleanupRef.timer) clearTimeout(cleanupRef.timer);
      cleanupRef.dispose?.();
    };
  }, [projects.length]);

  const scrollTo = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const top =
      el.getBoundingClientRect().top +
      window.scrollY -
      (id === "hero" ? 0 : 72);
    window.scrollTo({ top, behavior: "smooth" });
  }, []);

  const openViewer = useCallback((project: ProjectRow) => {
    setSelectedProject(null);
    setTimeout(() => setViewerProject(project), 300);
  }, []);

  return (
    <>
      <Loader />
      <Nav onNav={scrollTo} activeSection={activeSection} />
      <Hero onNav={scrollTo} />
      <Projects projects={projects} onOpenProject={setSelectedProject} />
      <About />
      <Team />
      <Services services={services} />
      <Contact settings={settings} />
      <Footer />

      {selectedProject && (
        <ProjectDetail
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
          onView3D={openViewer}
        />
      )}

      {viewerProject && (
        <Viewer3D
          project={viewerProject}
          onClose={() => setViewerProject(null)}
        />
      )}
    </>
  );
}
