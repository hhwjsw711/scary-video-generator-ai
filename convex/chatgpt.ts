"use node";
import { ConvexError, v } from "convex/values";
import { api, internal } from "./_generated/api";
import { internalAction } from "./_generated/server";
import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import { z } from "zod";
import { ChatCompletionMessageParam } from "openai/resources/index.mjs";
import { splitStory } from "@/lib/utils";
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const chatGptResSplitToSegmentSchema = z.object({
  segments: z.array(
    z.object({
      segment: z.string(),
      image: z.string(),
    }),
  ),
});
const chatGptResStoryGenerateSchema = z.object({
  story: z.string(),
});

// export const splitToSegment = internalAction({
//   args: {
//     story: v.string(),
//     storyId: v.id("stories"),
//     format: v.optional(v.union(v.literal("16:9"), v.literal("9:16"))),
//   },
//   handler: async (ctx, args) => {
//     await ctx.runMutation(internal.logs.create, {
//       message: "running split to segment",
//       function: "splitToSegment",
//     });

//     const systemPromt: ChatCompletionMessageParam = {
//       role: "system",
//       content: `You are an AI that creates horror videos based on the story provided by the user. Your task is to analyze the story, divide it into smaller segments, and create image prompts for each segment to assist an API in generating realistic images.
//         Requirements:
//         Analyze the story: Read the story input by the user and split it into smaller segments, each with a length of 4 to 8 sentences.
//         Create image prompts: Based on the content of each segment, generate a detailed image description (image prompt). This description should reflect the context, emotions, and atmosphere of that segment while being aligned with the horror theme.
//         Format: For each segment, use the following format:
//         Segment: [Content of the segment, keep the language of the user input's].
//         Image prompt: [Detailed description for the image, including elements such as color, lighting, setting, emotions, and key objects in the scene.
//         If there is people in the story, make sure to decribe to keep people's gender , age and appearance consistent over segment's image prompts.
//         Ensure that the image prompts can be easily translated into real images, focusing on creating the creepy and tense atmosphere of the story.
//         Keep image prompt in english.]
//         Carefully ensure that no part of the story is omitted.
//         Return the response as a Json array.

//         `,
//     };
//     try {
//       const completion = await openai.beta.chat.completions.parse({
//         model: "gpt-4o-2024-08-06",
//         messages: [
//           systemPromt,
//           {
//             role: "user",
//             content: args.story,
//           },
//         ],
//         response_format: zodResponseFormat(
//           chatGptResSplitToSegmentSchema,
//           "segments",
//         ),
//       });
//       const segmentArray = completion.choices[0]?.message.parsed?.segments;
//       await ctx.runMutation(internal.logs.create, {
//         message: JSON.stringify(segmentArray),
//         function: "splitToSegment",
//       });
//       if (segmentArray) {
//         const segmentIds = await ctx.runMutation(
//           internal.storySegments.saveSegments,
//           {
//             segments: segmentArray,
//             storyId: args.storyId,
//           },
//         );
//         //TODO :generate image for each segment prompt
//         await Promise.all(
//           segmentIds.map((s, i) =>
//             ctx.scheduler.runAfter(
//               0,
//               internal.replicate.generateImagesAndSave,
//               {
//                 data: [
//                   {
//                     prompt: segmentArray[i]?.image ?? "",
//                     format: args.format ?? "16:9",
//                     segmentId: s,
//                   },
//                 ],
//               },
//             ),
//           ),
//         );

//         // await ctx.scheduler.runAfter(30, internal.storySegments.timeout, { submissionId });
//       } else {
//         await ctx.runMutation(internal.logs.create, {
//           message: "Fail to get segments array from chatgpt",
//           function: "splitToSegment.error",
//         });
//       }
//     } catch (error) {
//       if (error instanceof Error) {
//         await ctx.runMutation(internal.logs.create, {
//           message: error.message,
//           function: "splitToSegment.error",
//         });
//       } else {
//         await ctx.runMutation(internal.logs.create, {
//           message: "Unkown error occur :<<",
//           function: "splitToSegment.error",
//         });
//       }
//     }
//   },
// });

export const generateStory = internalAction({
  args: {
    prompt: v.string(),
    name: v.string(),
    storyId: v.id("stories"),
    targetDuration: v.optional(v.number()),
    styleId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    try {
      const targetDuration = args.targetDuration || 30;
      const charCount = Math.round((targetDuration / 30) * 6000);

      const styles: Record<
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
          artStyle:
            "High-octane action with dynamic compositions. Explosive energy.",
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
          artStyle:
            "Neo-noir with stark contrasts and neon accents. Urban settings.",
          lighting:
            "High contrast with venetian blind shadows and neon highlights",
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
          cameraWork:
            "Centered framing, tracking shots, and planimetric composition",
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

      const selectedStyle =
        args.styleId && styles[args.styleId] ? styles[args.styleId] : null;
      const styleContext = selectedStyle
        ? `\n\nStyle Guide:
- Art Style: ${selectedStyle.artStyle}
- Mood: ${selectedStyle.mood}
- Lighting: ${selectedStyle.lighting}
- Color palette: ${selectedStyle.colorPalette}
- Camera work: ${selectedStyle.cameraWork}`
        : "";

      const sceneCount = Math.round((targetDuration / 30) * 6);
      const durationGuidance =
        targetDuration < 60
          ? `${targetDuration} seconds (${Math.round((targetDuration / 30) * 4)}-${sceneCount} scenes)`
          : targetDuration < 120
            ? `1 minute (${Math.round((targetDuration / 60) * 8)}-${Math.round((targetDuration / 60) * 12)} scenes)`
            : targetDuration < 180
              ? `2 minutes (${Math.round((targetDuration / 60) * 15)}-${Math.round((targetDuration / 60) * 20)} scenes)`
              : `3 minutes (${Math.round((targetDuration / 60) * 20)}-${Math.round((targetDuration / 60) * 30)} scenes)`;

      const systemPromt: ChatCompletionMessageParam = {
        role: "system",
        content: `You are a professional screenplay writer. Transform the user's story idea into a complete, emotionally resonant screenplay.

<USER_STORY_IDEA>
${args.prompt}
</USER_STORY_IDEA>

Transform the user's story idea into a professional screenplay format:
- Scene headings (EXT./INT. LOCATION - TIME)
- Action descriptions (what we see on screen)
- Character dialogue (character name above their lines)
- Camera directions and emotional descriptions in parentheses

Target video duration: ${durationGuidance}${styleContext}

Requirements:
1. OUTPUT LANGUAGE MUST MATCH THE USER'S INPUT LANGUAGE
2. Story must be complete, flowing, and emotionally compelling
3. Character dialogue must be natural
4. Scene descriptions must be vivid
5. Output only the screenplay text - no JSON, no markdown`,
      };
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-2024-08-06",
        messages: [
          systemPromt,
          {
            role: "user",
            content:
              "Please write a complete screenplay based on the story idea above. Keep the same language as the input.",
          },
        ],
        max_tokens: 8000,
        temperature: 0.7,
      });
      const story = completion.choices[0]?.message?.content || "";
      await ctx.runMutation(internal.stories.internalEdit, {
        content: story,
        id: args.storyId,
        AIGenerateInfo: {
          prompt: args.prompt,
          status: { state: "saved" },
          finishedRefine: false,
        },
      });
      return story;
    } catch (error) {
      await ctx.runMutation(internal.stories.internalEdit, {
        id: args.storyId,
        AIGenerateInfo: {
          prompt: args.prompt,
          finishedRefine: false,
          status: {
            state: "failed",
            reason: (error as Error).message,
          },
        },
      });
    }
  },
});

export const refineStory = internalAction({
  args: { prompt: v.string(), storyId: v.id("stories") },
  handler: async (ctx, args) => {
    try {
      const systemPromt: ChatCompletionMessageParam = {
        role: "system",
        content: `You are an horror teller AI's. Your task is  suport user  fix the story follow the user instuction's. `,
      };
      const completion = await openai.beta.chat.completions.parse({
        model: "gpt-4o-2024-08-06",
        messages: [
          systemPromt,
          {
            role: "user",
            content: args.prompt,
          },
        ],
        response_format: zodResponseFormat(
          chatGptResStoryGenerateSchema,
          "story",
        ),
      });
      const story = completion.choices[0]?.message.parsed?.story;
      await ctx.runMutation(internal.stories.internalEdit, {
        content: story,
        id: args.storyId,
        AIGenerateInfo: {
          prompt: args.prompt,
          status: { state: "saved" },
          finishedRefine: false,
        },
      });
      return story;
    } catch (error) {
      await ctx.runMutation(internal.stories.internalEdit, {
        id: args.storyId,
        AIGenerateInfo: {
          prompt: args.prompt,
          finishedRefine: false,
          status: {
            state: "failed",
            reason: (error as Error).message,
          },
        },
      });
    }
  },
});
export const generateContext = internalAction({
  args: {
    story: v.string(),
    storyId: v.id("stories"),
  },
  handler: async (ctx, args) => {
    try {
      const systemPromt: ChatCompletionMessageParam = {
        role: "system",
        content: `You are a AI teller horror stories.Each time user give you a horror story , return a short sumary  that captures the mood, setting,
        and key elements of the story, similar to this example :
        Example story :
        My mother was terminally ill and spent her last few days in a hospital bed. I would work throughout the week as usual,
        but over the weekend I would stay with her. Day and night.
        It became a routine and the nurse in charge of my mother would leave a pillow and blanket ready for me before I arrive.
        Claire was her name.
        She was the only real company I had left. I distanced myself from the outside world, the hospital and work were all I
        knew. When my mother lost her ability to speak, Claire was the only voice I heard since.
        The lights in the hospital were faulty. They flickered on and off. Some lights just gave out leaving many hallways in
        the dark.
        Example result : Set in a dimly lit hospital during the late evening, the scene is characterized by a weary,
        somber mood as the narrator, weary yet devoted, navigates the sterile environment in simple, worn clothing, while Claire,
        the compassionate nurse, appears in her scrubs, embodying a quiet strength amidst the despair;
        told from a reflective first-person perspective, the atmosphere is heavy with unspoken grief and solitude.
        `,
      };
      const completion = await openai.beta.chat.completions.parse({
        model: "gpt-4o-2024-08-06",
        messages: [
          systemPromt,
          {
            role: "user",
            content: args.story,
          },
        ],
        response_format: zodResponseFormat(
          z.object({ result: z.string() }),
          "result",
        ),
      });
      const context = completion.choices[0]?.message.parsed?.result;
      if (!context)
        throw new ConvexError("Unknow error when generating story context.");
      return context;
    } catch (error) {
      await ctx.runMutation(internal.logs.create, {
        message: (error as Error).message,
        function: "chatpgt.generateContext.error",
      });
      await ctx.runMutation(internal.stories.internalEdit, {
        id: args.storyId,
        context: {
          state: "failed",
          reason: (error as Error).message,
        },
      });
    }
  },
});
export const generateImagePrompt = internalAction({
  args: {
    context: v.string(),
    story: v.string(),
    segment: v.string(),
  },
  handler: async (ctx, args) => {
    try {
      const systemPromt: ChatCompletionMessageParam = {
        role: "system",
        content: `Each time the user give use an horror story, a context of that story and a segment of that story,
        generate an image prompt that capture the mood, setting, and key elements of the segment that fit best in the story and context input.
        Include a brief description of the age, appearance, and key characteristics of characters
        introduced in the context and segment. Ensure these descriptions are consistent across all image prompts.
        Capture the atmosphere of the setting (lighting, weather, landscape details) and ensure environmental elements
        are consistent from segment to segment, updating only as dictated by the story’s progression.
        Focus on ensuring that character actions and emotions are highlighted in the composition, with emphasis on creating
        a sense of horror and suspense appropriate to the tone of the segment.
        Technical details should enhance the mood and tension, such as using lighting, shadows, and textures that complement
          the scene.
        Example Context: The setting is a dimly lit evening in an old, creaky house filled with a musty smell
          and an unsettling atmosphere, where David, an ordinary man in a worn shirt and slacks, feels a heavy dread
          in the air as he confronts his sister Lily, a pale figure with wild hair and a manic gleam in her eyes; the
          mood is tense and foreboding, capturing the despair of a brother grappling with the darkness within himself,
          all conveyed through a third-person perspective.
        Example Segment : David always considered himself an ordinary man living in an ordinary town. He had a steady job, a few close friends, and a comfortable apartment with a view of the local park. But all of that was a fragile facade, one that could shatter with the slightest touch. The catalyst for this potential disaster was his sister, Lily.
        Corresponding image prompt for segment: A shadowy confrontation between a weary man and his eccentric sister in a dimly lit, neglected old house. The framing captures their tense expressions as David, wearing a worn shirt and slacks, stands with a look of dread on his face, while Lily, a pale figure with wild hair and a manic gleam in her eyes, looms in the foreground. Flickering candlelight casts eerie shadows on the cracked walls, creating a haunting atmosphere. The color palette features deep greens and grays to evoke decay and foreboding. The mood is heavy with tension and despair, as the composition conveys the lingering darkness within their relationship and David’s internal struggle. The image focuses on the intricate details of the house's creaking wood and the unsettling air, hinting at the horrors lurking just beneath the surface.
          `,
      };
      const completion = await openai.beta.chat.completions.parse({
        model: "gpt-4o-2024-08-06",
        messages: [
          systemPromt,
          {
            role: "user",
            content: `
            Story : ${args.story},
            Context : ${args.context},
            Segment : ${args.segment},
            `,
          },
        ],
        response_format: zodResponseFormat(
          z.object({ imagePrompt: z.string() }),
          "image_prompt",
        ),
      });
      const result = completion.choices[0]?.message.parsed;
      await ctx.runMutation(internal.logs.create, {
        message: JSON.stringify(result),
        function: "generateImagePrompt.imagePrompts",
      });
      if (!result)
        throw new ConvexError("Unknow error when generating image prompts.");
      return result.imagePrompt;
    } catch (error) {
      await ctx.runMutation(internal.logs.create, {
        message: (error as Error).message,
        function: "generateImagePrompt.imagePrompts",
      });
    }
  },
});
