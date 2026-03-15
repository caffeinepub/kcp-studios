export interface Character {
  name: string;
  role: string;
  lore: string;
  img: string;
  game: string;
  stats: Record<string, number>;
  personality: string;
  funFacts: string[];
  abilities: string[];
  firstAppearance: string;
  otherGames?: string[];
  color: string;
}

export const characters: Character[] = [
  {
    name: "Blizzard",
    role: "The Arctic Adventurer",
    lore: "Once a humble polar bear from the Frostheim Mountains, Blizzard discovered an ancient map hidden in the ice. Now he races across the frozen north, seeking the legendary Crystal of the Eternal Cold.",
    img: "/assets/generated/character-polar-bear-transparent.dim_400x400.png",
    game: "Arctic Runner",
    stats: { Speed: 85, Strength: 90, Courage: 95 },
    personality:
      "Brave and fiercely loyal, Blizzard never backs down from a challenge. He would cross a thousand blizzards for the ones he loves.",
    funFacts: [
      "Polar bears have black skin beneath their white fur — it absorbs sunlight for warmth in the Arctic.",
      "Blizzard can smell a fish buried under 3 feet of snow from half a mile away.",
      "Despite his size, Blizzard can run up to 25 mph on ice without slipping.",
      "He keeps a pocket-sized star map — he learned celestial navigation from an old Arctic explorer.",
      "Blizzard's roar has been known to shatter thin ice sheets and scatter rival enemies.",
    ],
    abilities: ["Ice Slam", "Blizzard Dash", "Glacier Roar", "Frost Shield"],
    firstAppearance: "Arctic Runner",
    otherGames: ["Save the Princess"],
    color: "#8B0000",
  },
  {
    name: "Pip",
    role: "Ocean Guardian",
    lore: "Born beneath the waves of the Polar Sea, Pip has protected the ocean's bounty since before memory. Quick on his feet and sharp of mind, he ensures no fish goes uncounted — and no rock goes un-dodged.",
    img: "/assets/generated/character-penguin-transparent.dim_400x400.png",
    game: "Penguin Catch",
    stats: { Speed: 95, Agility: 88, Heart: 92 },
    personality:
      "Clever and endlessly cheerful, Pip turns every obstacle into a game. His optimism is infectious — even glaciers seem to smile when he passes.",
    funFacts: [
      "Penguins are the only birds that can swim but not fly — and Pip is faster underwater than any bird in the air.",
      "Pip can hold his breath for up to 20 minutes during deep dives in icy waters.",
      "He collects smooth pebbles as gifts — in penguin culture, a pebble is the highest form of respect.",
      "Pip has memorized the location of every fish shoal within 40 miles of his home cove.",
      "Despite being just 3 feet tall, Pip's belly slide is powerful enough to knock over creatures ten times his size.",
    ],
    abilities: ["Belly Slide", "Fish Toss", "Dive Bomb", "Snowball Volley"],
    firstAppearance: "Penguin Catch",
    otherGames: ["Save the Princess"],
    color: "#6B0000",
  },
  {
    name: "Princess Vix",
    role: "Royal Ice Mage",
    lore: "Vix wandered out of the ancient Aurora Forest carrying secrets older than the ice itself. She wields frost magic with graceful precision, and some say her eyes can see the future frozen in every snowflake.",
    img: "/assets/generated/character-arctic-fox-transparent.dim_400x400.png",
    game: "Frost Fox Chronicles",
    stats: { Magic: 98, Wisdom: 94, Mystery: 97 },
    personality:
      "Wise and quietly mysterious, Princess Vix speaks in riddles only the worthy can decode. Her power comes not from force, but from understanding the deep language of ice and time.",
    funFacts: [
      "Arctic foxes can survive temperatures as low as -58°F — Vix has been seen walking through blizzards in full bloom.",
      "She can read the aurora borealis as a text written by ancient magic spirits.",
      "Vix's tail has seven rings of color — each one representing a vow she has kept.",
      "In the Frost Fox Chronicles lore, she is the youngest mage ever to master the Crystal Prophecy spell.",
      "Arctic foxes change fur color with the seasons; Vix's coat shifts from silver-white to gold when she channels her strongest magic.",
    ],
    abilities: ["Frost Nova", "Aurora Veil", "Crystal Prophecy", "Ice Mirror"],
    firstAppearance: "Frost Fox Chronicles",
    otherGames: ["Save the Princess"],
    color: "#9B1010",
  },
];
