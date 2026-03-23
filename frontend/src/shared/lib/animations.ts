import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function staggerReveal(
  selector: string,
  container: Element,
  opts?: { y?: number; stagger?: number; duration?: number; start?: string },
) {
  const { y = 40, stagger = 0.12, duration = 0.7, start = "top 85%" } = opts ?? {};
  gsap.fromTo(
    container.querySelectorAll(selector),
    { opacity: 0, y },
    {
      opacity: 1,
      y: 0,
      duration,
      stagger,
      ease: "power3.out",
      scrollTrigger: { trigger: container, start, once: true },
    },
  );
}

export function clipReveal(
  element: Element,
  opts?: { direction?: "left" | "bottom"; duration?: number },
) {
  const { direction = "left", duration = 1 } = opts ?? {};
  const from =
    direction === "left"
      ? "polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)"
      : "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)";
  const to = "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)";

  gsap.fromTo(element, { clipPath: from }, {
    clipPath: to,
    duration,
    ease: "power4.inOut",
    scrollTrigger: { trigger: element, start: "top 80%", once: true },
  });
}

export function parallaxY(
  selector: string,
  container: Element,
  amount = 30,
) {
  gsap.to(container.querySelectorAll(selector), {
    y: -amount,
    ease: "none",
    scrollTrigger: {
      trigger: container,
      start: "top bottom",
      end: "bottom top",
      scrub: 0.5,
    },
  });
}

export function fadeInUp(
  element: Element,
  opts?: { delay?: number; duration?: number; y?: number },
) {
  const { delay = 0, duration = 0.7, y = 30 } = opts ?? {};
  gsap.fromTo(
    element,
    { opacity: 0, y },
    {
      opacity: 1,
      y: 0,
      duration,
      delay,
      ease: "power3.out",
      scrollTrigger: { trigger: element, start: "top 85%", once: true },
    },
  );
}

export function scaleIn(
  element: Element,
  opts?: { delay?: number; duration?: number },
) {
  const { delay = 0, duration = 0.5 } = opts ?? {};
  gsap.fromTo(
    element,
    { scale: 0, opacity: 0 },
    {
      scale: 1,
      opacity: 1,
      duration,
      delay,
      ease: "back.out(1.7)",
      scrollTrigger: { trigger: element, start: "top 85%", once: true },
    },
  );
}

export { gsap, ScrollTrigger };
