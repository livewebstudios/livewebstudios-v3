/**
 * VySyn Assets (/clients/vysyn-assets): every file recovered from Chante
 * Ramsey's old VySyn Photography site, in the order of the handoff
 * (26_10_16_vysyn-assets-handoff.md, section 3). The images themselves live in
 * src/assets/clients/vysyn/<dir>/ under their original filenames; this list
 * carries what the files cannot: order, alt text and the LOW RES / STOCK tags.
 *
 * The page cross-checks this list against the folder at build time, so a file
 * added to or dropped from a folder without a matching edit here fails the
 * build instead of shipping a page that disagrees with the handoff.
 */

export type AssetTag = "lowres" | "stock";

export interface AssetFile {
  name: string;
  alt: string;
  tag?: AssetTag;
}

export interface AssetSection {
  dir: string; // folder under src/assets/clients/vysyn/
  id: string; // anchor for the jump bar
  num: string; // mono section label
  title: string; // <h2>
  jump: string; // jump bar pill text, ALL CAPS
  note: string;
  where: string;
  files: AssetFile[];
}

export const TOTAL_FILES = 56;

const LOGO_ALT = "VySyn Photography logo";

export const sections: AssetSection[] = [
  {
    dir: "0-logo",
    id: "logo",
    num: "00",
    title: "Logo",
    jump: "LOGO",
    note: "Your mark stays. These are the files from the old site. I'll rebuild the logo as a sharp vector file for the new one.",
    where: "Header, browser tab icon, social previews.",
    files: [
      { name: "cropped-VySyn-LOGO-Final-large-favicon-192x192.png", alt: LOGO_ALT },
      { name: "VySyn-LOGO-clipmask02.png", alt: LOGO_ALT },
      { name: "VySyn-LOGO-Final-long.png", alt: LOGO_ALT },
      { name: "VySyn-LOGO-Final-med.png", alt: LOGO_ALT },
    ],
  },
  {
    dir: "1-portraits",
    id: "portraits",
    num: "01",
    title: "Portraits",
    jump: "PORTRAITS",
    note: "Headshots and portraits. This becomes the Headshots gallery on the new site. Best of the best only.",
    where: "Headshots gallery.",
    files: [
      { name: "CathyBdayMay14-012-proc.jpg", alt: "Smiling woman in sunglasses and a patterned sleeveless top on a waterfront deck, black and white" },
      { name: "CR-BW-1960-WEB.jpg", alt: "Woman with her eyes closed above a busy city avenue, black and white" },
      { name: "DSC_0154-proc-web.jpg", alt: "Woman with her eyes closed in a gray tank top above a busy Manhattan avenue, in color" },
      { name: "MayaG_Oct16-2.jpg", alt: "Smiling woman with a red-blonde bob and a white shirt leaning on a tree in a park" },
      { name: "MayaJose2-proc.jpg", alt: "Smiling couple cheek to cheek, a man in a red shirt and a blonde woman, on a gray backdrop" },
      { name: "Photo-Jun-21-10-37-46-PM.jpg", alt: "Three-panel portrait collage: a woman with a shaved head, a laughing woman in glasses, and a woman with a bob in a denim vest" },
      { name: "SHE_Lili-240-e1475931061909.jpg", alt: "Woman with a bob in a denim vest and yellow dress, hand on hip, against a bright blurred street" },
      { name: "VickySHE-354.jpg", alt: "Smiling woman with long braids in a patterned top, hand on hip, on an outdoor plaza lined with flags" },
    ],
  },
  {
    dir: "2-fashion-and-creative",
    id: "fashion-creative",
    num: "02",
    title: "Fashion & Creative",
    jump: "FASHION & CREATIVE",
    note: "The heart of the new site. Fashion week, styled shoots, and the creative sessions.",
    where: "Creative Projects gallery and case studies.",
    files: [
      { name: "45491649_10155650722931784_1066429487559737344_n.jpg", alt: "Woman in a camel coat, cat-eye glasses and kente cloth accents in front of a black and white mural" },
      { name: "BOE-11.12.17-SHOOT-6-600x500.jpg", alt: "Woman in a blue denim head wrap and gold hoop earrings with her eyes lowered" },
      { name: "BOE-11.12.17-SHOOT-15-600x500.jpg", alt: "Woman in a green and red print head wrap and orange lipstick, glancing over her shoulder" },
      { name: "BOE-11.12.17-SHOOT-17-600x500.jpg", alt: "Woman with copper hair, a nose ring and a black velvet choker, one hand in her hair" },
      { name: "BOE-11.12.17-SHOOT-19-600x500.jpg", alt: "Woman with a gold leaf crown and a sheer black veil over bare shoulders" },
      { name: "BOE-11.26.17-SHOOT-14-600x500.jpg", alt: "Woman with purple eye shadow, blue lipstick and a red beaded necklace on a gray backdrop" },
      { name: "BOE-11.26.17-SHOOT-21-600x500.jpg", alt: "Woman with blue and purple eye makeup cradling her face in both hands" },
      { name: "BOE-11.26.17-SHOOT-23-600x500.jpg", alt: "Woman with her eyes closed and blue shimmer makeup, hands folded at her neck" },
      { name: "BOE-11.26.17-SHOOT-35-600x500.jpg", alt: "Close-up of a woman with sculpted blue and gold eye makeup against an orange backdrop" },
      { name: "BOE-11.26.17-SHOOT-39-600x500.jpg", alt: "Woman with blue and gold winged eye makeup and long blue beaded earrings" },
      { name: "BOE-11.26.17-SHOOT-43-600x500.jpg", alt: "Woman with gold eye shadow and tassel earrings, eyes closed, on a lavender backdrop" },
      { name: "NYFWFW18_Adres-41-600x700.jpg", alt: "Man in a black leather jacket and red knit sweater on a city street" },
      { name: "NYFWFW18_Cordell_Shamaine-12-600x700.jpg", alt: "Woman in aviator sunglasses and a black leather jacket on a street with yellow road lines" },
      { name: "NYFWFW18_Cordell_Shamaine-35-600x700.jpg", alt: "Young man in a leather jacket and cream scarf against a brick wall" },
      { name: "NYFWFW18_GrandCentral-15-600x700.jpg", alt: "Man with locs and round sunglasses adjusting his tie in a dark suit, black and white" },
      { name: "NYFWFW18_Kemi_Chelsea-19-600x700.jpg", alt: "Woman with long curly blonde hair and a pink scarf looking back over her shoulder on a city street" },
      { name: "NYFWFW18_Narinderjit-17-600x700.jpg", alt: "Man in a black turban, round glasses and a bleached denim jacket against weathered wood" },
      { name: "NYFWFW18_Pierre-Tribe-10-600x700.jpg", alt: "Man in a burgundy suit and black turtleneck beside a stone colonnade" },
      { name: "NYFWFW18_Shanice-21-600x700.jpg", alt: "Woman in a navy leather jacket with a white collar, posed in a doorway" },
      { name: "NYFWFW18_Shayna-38.jpg", alt: "Woman with long blonde braids and a plaid scarf seated on a city sidewalk" },
      { name: "NYFWFW18_Shirley-26-600x700.jpg", alt: "Smiling woman in a black and white sweater on a train platform" },
      { name: "NYFWFW18_Taurean-20-150x233.jpg", alt: "Athletic man in a fitted pink shirt on a bridge walkway", tag: "lowres" },
      { name: "Photo-Dec-03-6-45-18-PM-web.jpg", alt: "Woman in silhouette against a tall gridded window in dim light" },
      { name: "style-bf-fierce.jpg", alt: "Woman in a black feather collar looking over her shoulder, black and white", tag: "lowres" },
      { name: "Style-Ciara.jpg", alt: "Woman with long waves, pink lipstick and a heavy gold chain necklace", tag: "lowres" },
      { name: "style-flower-girl350.jpg", alt: "Woman with yellow and purple flowers placed across her face and bright eye makeup", tag: "lowres" },
      { name: "style-jessica.jpg", alt: "Woman in a black wide-brim hat holding makeup brushes to her cheek", tag: "lowres" },
      { name: "TFPSHOOT-TENNEILLEAUG17-72.jpg", alt: "Woman in a head wrap and beaded collar necklace against a metal security gate, black and white" },
    ],
  },
  {
    dir: "3-branding",
    id: "branding",
    num: "03",
    title: "Branding",
    jump: "BRANDING",
    note: "Brand shoots with makers and business owners. You told me you'd rather shoot the people behind the product. These prove it.",
    where: "Creative Projects and case studies.",
    files: [
      { name: "4R2A5000-web.jpg", alt: "Woman in a bold print head wrap and green cardigan shooting with a camera in a park" },
      { name: "brand-elevation-bakers2-web.jpg", alt: "Two smiling women in blue gloves beside a rack of handmade soap bars" },
      { name: "gf-bakery-kitchen-web.jpg", alt: "Baker in glasses, a print head wrap and an apron in her kitchen beside a red EAT sign" },
      { name: "style-header01.jpg", alt: "Stylist in a face mask working on a client's red braided updo" },
    ],
  },
  {
    dir: "4-events",
    id: "events",
    num: "04",
    title: "Events",
    jump: "EVENTS",
    note: "Event work. It isn't a main focus going forward, so tell me if any of these should stay.",
    where: "Your call.",
    files: [
      { name: "12734019_10153212081986784_6937487903499960281_n-web.jpg", alt: "Guests mingling at a party under silver balloons, a woman in a metallic dress at the center" },
      { name: "micro-event-01.jpg", alt: "Couple face to face, the bride in a pink flower crown and the groom in a white hat" },
      { name: "micro-event02.jpg", alt: "Couple holding hands on courthouse steps, the groom in a velvet tuxedo and the bride in a sequined gown" },
    ],
  },
  {
    dir: "chante",
    id: "chante",
    num: "05",
    title: "Chante",
    jump: "CHANTE",
    note: "You, behind the lens.",
    where: "About page.",
    files: [
      { name: "Chante-profile.jpg", alt: "Chante with one hand across her face and a silver necklace, against a teal wall" },
      { name: "Chanteedited.jpg", alt: "Chante smiling in a patterned blouse in an office with framed art behind her" },
      { name: "Photo-Jun-07-5-01-04-PM.jpg", alt: "Selfie of two smiling women, one with a camera hanging from her shoulder" },
      { name: "VySyn-chante-self.jpg", alt: "Chante holding a camera, seated on a bench in front of teal arched doors" },
    ],
  },
  {
    dir: "graphics-and-backgrounds",
    id: "graphics-backgrounds",
    num: "06",
    title: "Graphics & Backgrounds",
    jump: "GRAPHICS & BACKGROUNDS",
    note: "Backgrounds and graphics from the old design. A couple may come back as section backgrounds. Most will retire.",
    where: "Background textures, if any.",
    files: [
      { name: "brooklyn-b-bg.jpg", alt: "Brooklyn Bridge and the Manhattan skyline at night reflected in the river, black and white" },
      { name: "camera-bg02.jpg", alt: "Compact camera on a windowsill overlooking a misty skyline, black and white" },
      { name: "camera-bg03.jpg", alt: "Canon AE-1 film camera on a table, black and white" },
      { name: "cropped-Photo-Jul-03-2-39-33-PM-270x270.jpg", alt: "Camera body and lenses on a purple cloth in the grass", tag: "lowres" },
      { name: "pexels-ajay-lobo-1205022-2.jpg", alt: "Canon DSLR resting on a ledge beside its strap, black and white", tag: "stock" },
    ],
  },
];
