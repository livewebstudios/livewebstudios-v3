import "./aurora.css";

/**
 * Aurora
 * Animated gradient hero background. Pure CSS motion, zero JS at runtime.
 *
 * Props:
 *   colors   [string, string, string]  three hex values, light to dark
 *   base     string                    background color behind the orbs
 *   speed    number                    seconds for the slowest drift cycle
 *   blur     string                    blur radius, e.g. "110px"
 *   grain    boolean                   noise + vignette overlay (default true)
 *   className string                   extra classes for the wrapper
 *   children ReactNode                 your hero content
 */
export default function Aurora({
  colors = ["#00a9e0", "#1e5f8c", "#0e7f9c"],
  base = "#0a1420",
  speed = 32,
  blur = "110px",
  grain = true,
  className = "",
  children,
}) {
  const [c1, c2, c3] = colors;
  // Custom properties only. No visual styling is set inline.
  const vars = {
    "--aurora-bg": base,
    "--aurora-1": c1,
    "--aurora-2": c2,
    "--aurora-3": c3,
    "--aurora-speed": `${speed}s`,
    "--aurora-blur": blur,
  };
  return (
    <section
      className={`aurora${grain ? " aurora--grain" : ""} ${className}`.trim()}
      style={vars}
    >
      <div className="aurora__orb aurora__orb--a" aria-hidden="true" />
      <div className="aurora__orb aurora__orb--b" aria-hidden="true" />
      <div className="aurora__orb aurora__orb--c" aria-hidden="true" />
      <div className="aurora__content">{children}</div>
    </section>
  );
}
