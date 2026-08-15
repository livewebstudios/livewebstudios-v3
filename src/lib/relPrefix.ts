/**
 * relPrefix — compute the "../" prefix a page needs to reach the site root,
 * from its own URL. Lets the shared chrome (Nav, Footer, VideoBg, StudiosPanel)
 * keep every asset + link reference RELATIVE (per the LWS path rule) while
 * still resolving correctly on nested pages like /services/website-design or
 * /live-band-web-studios/forms/band-bio-form.
 *
 * Root page  "/"                              -> ""        (images/logoRGB.png)
 * Root file  "/about"                         -> ""
 * 1 deep     "/services/website-design"       -> "../"
 * 2 deep     "/live-band-web-studios/forms/x" -> "../../"
 * Dir index  "/industries/"                   -> "../"
 */
export function relPrefix(pathname: string): string {
  const segs = pathname.replace(/^\/|\/$/g, "").split("/").filter(Boolean);
  const endsSlash = pathname.endsWith("/");
  const depth = endsSlash ? segs.length : Math.max(0, segs.length - 1);
  return "../".repeat(depth);
}
