export const STYLE_PRESETS: Record<
  string,
  {
    mood: string;
    artStyle: string;
    lighting: string;
    colorPalette: string;
    cameraWork: string;
  }
> = {
  "product-ad": {
    mood: "Fresh, sensory, and effortlessly cool",
    artStyle:
      "Modern social-first product photography with tactile, editorial energy. Products shown in real-life context.",
    lighting:
      "Bright natural window light with clean directional shadows. Golden hour warmth for lifestyle moments.",
    colorPalette: "white, cream, pink, black, green",
    cameraWork:
      "Dynamic mix of handheld and locked shots. Quick-cut to locked beauty frames. Macro details on textures.",
  },
  "real-estate": {
    mood: "Luxurious, aspirational, and effortlessly glamorous",
    artStyle:
      "Prestige property cinematography with editorial lifestyle sensibility. Luxury interiors with depth and grandeur.",
    lighting:
      "Late afternoon golden hour streaming through windows. Rim light catching hair and shoulders.",
    colorPalette: "cream, gold, brown, beige, dark brown",
    cameraWork:
      "Slow, cinematic dolly movements through grand interiors. Smooth reveals through doorways.",
  },
  animatic: {
    mood: "Rough, working-draft, evocative but unfinished",
    artStyle:
      "Rough storyboard panels rendered as if drawn in pencil and marker on paper. Confident gestural line work.",
    lighting:
      "Implied lighting only. Shape and value suggested through marker shading.",
    colorPalette: "warm off-white, dark brown, gray, red, blue",
    cameraWork:
      "Static storyboard panels. Camera moves indicated graphically with arrows.",
  },
  corporate: {
    mood: "Professional, innovative, and trustworthy",
    artStyle:
      "Contemporary corporate visual style with clean geometry and professional environments.",
    lighting:
      "Bright, even overhead lighting. Soft and clean with no dramatic shadows.",
    colorPalette: "blue, white, dark blue, green, gray",
    cameraWork:
      "Smooth dolly or gimbal movements through workspace environments. Static or slow-push medium shots.",
  },
  "award-season": {
    mood: "Introspective and emotional",
    artStyle:
      "Cinematic drama with deep shadows and warm tones. Character-driven narratives.",
    lighting: "Dramatic chiaroscuro lighting with strong contrast",
    colorPalette: "brown, orange, tan, dark slate, gray",
    cameraWork: "Slow, deliberate movements with meaningful close-ups",
  },
  documentary: {
    mood: "Authentic and immediate",
    artStyle:
      "Natural documentary style with authentic environments. Real people in real situations.",
    lighting: "Natural and available light only",
    colorPalette: "brown, tan, beige, wheat, orange",
    cameraWork: "Handheld camera with observational framing",
  },
  action: {
    mood: "Exciting and adrenaline-pumping",
    artStyle: "High-octane action with dynamic compositions. Explosive energy.",
    lighting: "High contrast with dramatic rim lighting",
    colorPalette: "orange, yellow, blue, red, orange",
    cameraWork: "Fast cuts, sweeping crane shots, and dynamic angles",
  },
  "rom-com": {
    mood: "Light, romantic, and optimistic",
    artStyle:
      "Warm and inviting with soft, romantic lighting. Cheerful and feel-good.",
    lighting: "Soft, diffused lighting with warm tones",
    colorPalette: "pink, peach, lavender, blue, yellow",
    cameraWork: "Smooth movements with intimate framing",
  },
  animated: {
    mood: "Intense, layered, and emotionally complex",
    artStyle:
      "High-fidelity stylized animation with painterly textures. Richly layered environments.",
    lighting:
      "Dramatic volumetric lighting with god rays, atmospheric haze, and deep contrast.",
    colorPalette: "dark blue, gold, burgundy, dark teal, tan",
    cameraWork:
      "Cinematic camera language. Slow tracking shots through detailed environments.",
  },
  "neo-noir": {
    mood: "Tense and mysterious",
    artStyle: "Neo-noir with stark contrasts and neon accents. Urban settings.",
    lighting: "High contrast with venetian blind shadows and neon highlights",
    colorPalette: "black, red, cyan, purple, pink",
    cameraWork: "Dutch angles and voyeuristic framing",
  },
  pastel: {
    mood: "Whimsical melancholy, deadpan charm, nostalgic precision",
    artStyle:
      "Obsessively symmetrical, centered, planimetric frontal framing. Candy-colored pastels.",
    lighting:
      "Soft, perfectly even diffused lighting with minimal shadows. Warm tones.",
    colorPalette: "pink, sky blue, yellow, lavender, mint green",
    cameraWork: "Centered framing, tracking shots, and planimetric composition",
  },
  "sci-fi": {
    mood: "Futuristic and technological",
    artStyle:
      "Futuristic sci-fi with clean lines and holographic elements. High-tech aesthetics.",
    lighting: "Cool LED lighting with lens flares",
    colorPalette: "cyan, blue, silver, purple, green",
    cameraWork: "Smooth camera movements with wide establishing shots",
  },
  "horror-gothic": {
    mood: "Ominous and foreboding",
    artStyle:
      "Gothic horror with dark shadows and eerie atmosphere. Atmospheric dread.",
    lighting: "Low-key lighting with harsh shadows",
    colorPalette: "black, dark red, dark blue, dark gray, gray",
    cameraWork: "Unsettling angles and slow zooms",
  },
  western: {
    mood: "Epic and frontier-inspired",
    artStyle:
      "Classic Western with wide landscapes and golden hour lighting. Dusty and romantic.",
    lighting: "Magic hour lighting with long shadows",
    colorPalette: "brown, tan, beige, orange, gold",
    cameraWork: "Wide shots, slow zooms, and classic Western framing",
  },
  "lo-fi-retro": {
    mood: "Nostalgic, amateur, authentic snapshot quality with no professional polish",
    artStyle:
      "Retro smartphone JPEG aesthetic. Visible digital compression artifacts.",
    lighting:
      "Low dynamic range. Highlights blown out, shadows crushed and grainy.",
    colorPalette: "beige, tan, brown, white, dark slate",
    cameraWork:
      "Handheld amateur perspective. Slight micro-jitters. Less sophisticated stabilization.",
  },
};
