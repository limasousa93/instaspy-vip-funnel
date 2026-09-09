export interface MockInstagramProfile {
  username: string;
  fullName: string;
  biography: string;
  followersCount: number;
  followsCount: number;
  postsCount: number;
  profilePicUrl: string;
  verified: boolean;
  externalUrl?: string;
}

export interface MockInstagramPost {
  id: string;
  likes: number;
  comments: number;
  caption: string;
  mediaUrl: string;
  timestamp: string;
  type: "Image" | "Video";
}

export interface MockInstagramData {
  profile: MockInstagramProfile;
  posts: MockInstagramPost[];
}

function isoDaysAgo(days: number, hours = 0): string {
  const date = new Date();
  date.setDate(date.getDate() - days);
  date.setHours(date.getHours() - hours);
  return date.toISOString();
}

function buildPosts(
  username: string,
  entries: Array<{ likes: number; comments: number; caption: string; type: "Image" | "Video"; daysAgo: number }>
): MockInstagramPost[] {
  return entries.map((entry, index) => ({
    id: `${username}${index + 1}`,
    likes: entry.likes,
    comments: entry.comments,
    caption: entry.caption,
    mediaUrl: `https://picsum.photos/seed/${username}${index + 1}/600/600`,
    timestamp: isoDaysAgo(entry.daysAgo),
    type: entry.type,
  }));
}

export const mockInstagramAccounts: Record<string, MockInstagramData> = {
  nasa: {
    profile: {
      username: "nasa",
      fullName: "NASA",
      biography:
        "Explore the universe and discover our home planet with the official NASA Instagram account. 🚀🌎\n#NASA",
      followersCount: 97_300_000,
      followsCount: 71,
      postsCount: 4021,
      profilePicUrl: "https://picsum.photos/seed/nasa-avatar/300/300",
      verified: true,
      externalUrl: "https://www.nasa.gov",
    },
    posts: buildPosts("nasa", [
      { likes: 812_400, comments: 5_120, caption: "A galaxy far, far away — actually just 2.5 million light-years from home. Say hello to Andromeda. 🌌", type: "Image", daysAgo: 1 },
      { likes: 645_900, comments: 3_870, caption: "Sunrise over the Pacific, as seen from the International Space Station.", type: "Image", daysAgo: 2 },
      { likes: 921_300, comments: 8_640, caption: "Watch: 60 seconds of Artemis II preparations at Kennedy Space Center. 🚀", type: "Video", daysAgo: 3 },
      { likes: 533_100, comments: 2_990, caption: "Jupiter's Great Red Spot, captured in stunning detail by Juno.", type: "Image", daysAgo: 5 },
      { likes: 701_800, comments: 4_410, caption: "Astronaut Loral O'Hara conducting a spacewalk outside the ISS.", type: "Image", daysAgo: 6 },
      { likes: 489_200, comments: 2_150, caption: "This is what a supernova remnant looks like in X-ray and infrared light.", type: "Image", daysAgo: 8 },
      { likes: 875_600, comments: 6_720, caption: "Watch: Perseverance rover's descent onto the Martian surface, frame by frame.", type: "Video", daysAgo: 10 },
      { likes: 412_500, comments: 1_980, caption: "The Pillars of Creation, reimagined by the James Webb Space Telescope.", type: "Image", daysAgo: 12 },
      { likes: 567_300, comments: 3_340, caption: "Aurora australis dancing over Antarctica, seen from orbit.", type: "Image", daysAgo: 14 },
      { likes: 398_700, comments: 1_760, caption: "Meet the crew: four astronauts preparing for their next mission to the ISS.", type: "Image", daysAgo: 16 },
      { likes: 734_900, comments: 5_580, caption: "Watch: how solar flares can affect satellites and power grids on Earth.", type: "Video", daysAgo: 19 },
      { likes: 456_800, comments: 2_430, caption: "Saturn's rings, imaged in the sharpest detail yet by ground-based telescopes.", type: "Image", daysAgo: 22 },
    ]),
  },
  natgeo: {
    profile: {
      username: "natgeo",
      fullName: "National Geographic",
      biography:
        "Taking care of the planet is more important now than ever. 🌍\nExperience our world through the eyes of NatGeo photographers.",
      followersCount: 279_400_000,
      followsCount: 138,
      postsCount: 30_215,
      profilePicUrl: "https://picsum.photos/seed/natgeo-avatar/300/300",
      verified: true,
      externalUrl: "https://on.natgeo.com/instagram",
    },
    posts: buildPosts("natgeo", [
      { likes: 612_300, comments: 3_210, caption: "A snow leopard pauses on a ridge in the Himalayas, rarely seen this close.", type: "Image", daysAgo: 1 },
      { likes: 548_900, comments: 2_870, caption: "Bioluminescent plankton light up the tide on a moonless night.", type: "Image", daysAgo: 2 },
      { likes: 701_200, comments: 4_950, caption: "Photo by @paulnicklen — a leopard seal investigates the camera in Antarctica.", type: "Image", daysAgo: 4 },
      { likes: 823_600, comments: 6_310, caption: "Watch: the incredible migration of monarch butterflies across three countries.", type: "Video", daysAgo: 5 },
      { likes: 459_700, comments: 2_040, caption: "Sand dunes shift under the wind in Namibia's Sossusvlei at golden hour.", type: "Image", daysAgo: 7 },
      { likes: 587_400, comments: 3_120, caption: "A young orangutan learns to forage alongside its mother in Borneo.", type: "Image", daysAgo: 9 },
      { likes: 635_800, comments: 3_990, caption: "Lightning splits the sky over the plains during monsoon season.", type: "Image", daysAgo: 11 },
      { likes: 792_100, comments: 5_670, caption: "Watch: divers document a coral reef recovering after a bleaching event.", type: "Video", daysAgo: 13 },
      { likes: 512_900, comments: 2_460, caption: "A lone wolf tracks through fresh snow in Yellowstone National Park.", type: "Image", daysAgo: 15 },
      { likes: 468_300, comments: 1_890, caption: "Terraced rice paddies in Yunnan reflect the colors of sunset.", type: "Image", daysAgo: 18 },
      { likes: 674_500, comments: 4_280, caption: "Watch: a time-lapse of the Milky Way rising over the Atacama Desert.", type: "Video", daysAgo: 20 },
      { likes: 539_600, comments: 2_710, caption: "A hummingbird hovers mid-sip, wings frozen by a high-speed shutter.", type: "Image", daysAgo: 23 },
    ]),
  },
};
