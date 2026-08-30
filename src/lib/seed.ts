import type { TomeState } from "./types";

const ASSET = "/campaign/ashen-crown";
const V = "v=3";

export const SEED_CAMPAIGN_ID = "camp_ashen";

export const SEED: TomeState = {
  campaigns: [
    {
      id: SEED_CAMPAIGN_ID,
      name: "The Ashen Crown",
      world: "The Cinder Marches",
      premise:
        "A cracked crown fragment has begun to wake the old fire under the Marches. Four companions follow its trail from a rain-soaked inn to a bridge of ash.",
      coverUrl: `${ASSET}/cover.jpg?${V}`,
      createdAt: "2026-03-14T20:00:00.000Z",
      updatedAt: "2026-04-11T23:40:00.000Z",
    },
  ],
  characters: [
    {
      id: "char_mira",
      campaignId: SEED_CAMPAIGN_ID,
      name: "Mira Solenne",
      kind: "pc",
      race: "Human",
      classOrRole: "Paladin",
      appearance:
        "Human paladin woman about thirty-two, short copper-brown hair cropped at the jaw, a thin pale scar from left temple to cheekbone, warm olive skin, amber-brown eyes, resolute, scarred steel breastplate with a bronze sunburst, a cloak the color of dried crimson lined in cream, leather gauntlets",
      portraitUrl: `${ASSET}/characters/mira.jpg?${V}`,
      notes:
        "Oath of the banked hearth. Speaks little at the table, then decides for everyone. The cracked sunburst on her breastplate is from the night her first temple burned.",
      status: "alive",
      firstSeenSessionId: "sess_1",
    },
    {
      id: "char_torren",
      campaignId: SEED_CAMPAIGN_ID,
      name: "Torren Ashvein",
      kind: "pc",
      race: "Dwarf",
      classOrRole: "Fighter",
      appearance:
        "Dwarf fighter man about fifty-four, stocky and barrel-chested, charcoal-black beard in two thick braids bound with bronze rings, missing the tip of his left ear, storm-gray eyes, wry half-smile, weathered face, russet leather under burnished iron half-plate, a massive notched greataxe with dried blood in the bite",
      portraitUrl: `${ASSET}/characters/torren.jpg?${V}`,
      notes:
        "Ex-pit fighter from the slag towns. Claims he is only here for the coin. Stays after every fight to bury the dead.",
      status: "alive",
      firstSeenSessionId: "sess_1",
    },
    {
      id: "char_lira",
      campaignId: SEED_CAMPAIGN_ID,
      name: "Lira Quill",
      kind: "pc",
      race: "Tiefling",
      classOrRole: "Wizard",
      appearance:
        "Tiefling wizard woman about twenty-four, terracotta-red skin, two small backswept horns of polished dark horn, ink-black hair in a loose side braid, amber-gold eyes, ink-stained fingertips, sharp curious face, burgundy scholar's robes with gold thread at the cuffs, a moth-eaten leather spellbook under one arm",
      portraitUrl: `${ASSET}/characters/lira.jpg?${V}`,
      notes:
        "Writes everything. Treats the Marches like a thesis she did not ask to live inside. Her spellbook smells of smoke even when it is closed.",
      status: "alive",
      firstSeenSessionId: "sess_1",
    },
    {
      id: "char_edric",
      campaignId: SEED_CAMPAIGN_ID,
      name: "Edric Vale",
      kind: "pc",
      race: "Half-elf",
      classOrRole: "Ranger",
      appearance:
        "Half-elf ranger man about twenty-eight, weathered tan skin, dark brown hair tied back with a hawk feather, quiet moss-green eyes, lean, forest-green hooded cloak over honey-brown scarred leather, leather bracers, a longbow of dark yew, three days of stubble",
      portraitUrl: `${ASSET}/characters/edric.jpg?${V}`,
      notes:
        "Grew up on the ridge roads. Tracks ash the way other rangers track deer. Does not sleep facing a door.",
      status: "alive",
      firstSeenSessionId: "sess_1",
    },
    {
      id: "char_caldren",
      campaignId: SEED_CAMPAIGN_ID,
      name: "Sister Caldren",
      kind: "npc",
      race: "Human",
      classOrRole: "Priestess of the Banked Hearth",
      appearance:
        "Elderly human priestess about seventy, white hair in a simple coil, deep-lined kind face, pale gray eyes, cream linen vestments with a vivid ember-red hem, wooden prayer bead bracelet",
      portraitUrl: `${ASSET}/characters/caldren.jpg?${V}`,
      notes:
        "Last keeper of the chapel above Cinderfall. She has been waiting for someone willing to carry a burning thing without wanting to wear it.",
      status: "alive",
      firstSeenSessionId: "sess_1",
    },
    {
      id: "char_warden",
      campaignId: SEED_CAMPAIGN_ID,
      name: "The Cinder Warden",
      kind: "npc",
      race: "Unknown",
      classOrRole: "Warden of the buried fire",
      appearance:
        "Tall armored figure in blackened iron plate etched with hairline cracks that glow coal-orange, a closed helm with a single horizontal visor slit, no skin visible, a tattered cloak the color of woodsmoke, gauntlets gripping a long iron glaive stained with dried blood",
      portraitUrl: `${ASSET}/characters/warden.jpg?${V}`,
      notes:
        "Speaks in a voice like a grate being dragged. Claims the crown is not treasure. Claims it is a lid.",
      status: "alive",
      firstSeenSessionId: "sess_3",
    },
  ],
  sessions: [
    {
      id: "sess_1",
      campaignId: SEED_CAMPAIGN_ID,
      number: 1,
      title: "The Inn at Cinderfall",
      playedOn: "2026-03-14",
      summary:
        "Rain kept the road closed, so four strangers shared a table at the Inn at Cinderfall and pretended they were not listening to each other. Sister Caldren arrived after last call with a rag-wrapped shard of blackened crown. It still held heat. She asked them not to wear it, not to sell it, and not to leave it in her chapel overnight. By morning the party had a name for the work, a direction into the Marches, and a quiet agreement that none of them would sleep well until the fragment was someone else's problem.",
      events: [
        {
          id: "ev_1_1",
          text: "Mira paid the innkeeper in temple coin and claimed the corner table without asking.",
          characterIds: ["char_mira"],
        },
        {
          id: "ev_1_2",
          text: "Torren lost three rounds of dice, then won the fourth by accident and bought the table a round anyway.",
          characterIds: ["char_torren"],
        },
        {
          id: "ev_1_3",
          text: "Lira copied the inn's fire-ward sigils into her book before anyone noticed they were wrong.",
          characterIds: ["char_lira"],
        },
        {
          id: "ev_1_4",
          text: "Edric watched the door for two hours and named every traveler by the mud on their boots.",
          characterIds: ["char_edric"],
        },
        {
          id: "ev_1_5",
          text: "Sister Caldren unwrapped the crown fragment. It smoked. Mira did not reach for it. Torren did, then thought better.",
          characterIds: ["char_caldren", "char_mira", "char_torren"],
        },
      ],
      characterIds: [
        "char_mira",
        "char_torren",
        "char_lira",
        "char_edric",
        "char_caldren",
      ],
      locationIds: ["loc_inn", "loc_chapel"],
      status: "complete",
      createdAt: "2026-03-14T23:10:00.000Z",
    },
    {
      id: "sess_2",
      campaignId: SEED_CAMPAIGN_ID,
      number: 2,
      title: "The Hollow Barrow",
      playedOn: "2026-03-28",
      summary:
        "Edric found the barrow by the way the grass refused to grow. Inside, the dead were not waiting so much as working — packing ash into the joints of old armor, trying to stand. Mira held the choke-point. Torren broke the sarcophagus that was feeding them. Lira named the working for what it was: a lid under strain. They left with a second fragment, a cracked rib on Mira, and the certainty that something under the Marches had noticed they were looking.",
      events: [
        {
          id: "ev_2_1",
          text: "Edric marked three false mouths in the hillside before the true barrow showed itself.",
          characterIds: ["char_edric"],
        },
        {
          id: "ev_2_2",
          text: "Mira took a spear through the edge of her breastplate and did not step back.",
          characterIds: ["char_mira"],
        },
        {
          id: "ev_2_3",
          text: "Torren split the sarcophagus lid. The bone-workers collapsed as if a string had been cut.",
          characterIds: ["char_torren"],
        },
        {
          id: "ev_2_4",
          text: "Lira traced the inward-facing runes and warned that the barrow was not a tomb. It was a bung.",
          characterIds: ["char_lira"],
        },
      ],
      characterIds: ["char_mira", "char_torren", "char_lira", "char_edric"],
      locationIds: ["loc_barrow"],
      status: "complete",
      createdAt: "2026-03-28T23:40:00.000Z",
    },
    {
      id: "sess_3",
      campaignId: SEED_CAMPAIGN_ID,
      number: 3,
      title: "The Bridge of Embers",
      playedOn: "2026-04-11",
      summary:
        "The road ended at a stone bridge over a river that was no longer water. The Cinder Warden was already waiting in the middle of it, glaive planted, helm shut. He called the fragments a lid and the party a set of thieves who did not know what they were unsealing. Mira answered with her oath. The fight that followed was short, ugly, and unfinished. Lira threw a pale ward around Mira when the glaive found a seam in the sunburst. The Warden stepped back into the ash-wind and was gone, leaving only the smell of a grate dragged across stone. They still have the fragments. They no longer pretend this is a fetch quest.",
      events: [
        {
          id: "ev_3_1",
          text: "Edric and Lira scouted the ridgeline at dusk and saw the bridge before the others did.",
          characterIds: ["char_edric", "char_lira"],
        },
        {
          id: "ev_3_2",
          text: "The Cinder Warden named the crown a lid and the party thieves.",
          characterIds: ["char_warden"],
        },
        {
          id: "ev_3_3",
          text: "Mira held the near end of the bridge. Torren kept the Warden's glaive from finding her throat.",
          characterIds: ["char_mira", "char_torren", "char_warden"],
        },
        {
          id: "ev_3_4",
          text: "The glaive found a seam. Lira's ward took the rest of the blow. Mira stayed on her feet.",
          characterIds: ["char_lira", "char_mira"],
        },
      ],
      characterIds: [
        "char_mira",
        "char_torren",
        "char_lira",
        "char_edric",
        "char_warden",
      ],
      locationIds: ["loc_ridge", "loc_bridge"],
      status: "complete",
      createdAt: "2026-04-11T23:40:00.000Z",
    },
  ],
  scenes: [
    {
      id: "scene_inn",
      campaignId: SEED_CAMPAIGN_ID,
      sessionId: "sess_1",
      title: "A table claimed in the rain",
      beat: "Four strangers share a scarred oak table at the Inn at Cinderfall: hanging lanterns, amber ale, a hearth in full color, rain on leaded glass.",
      kind: "roleplay",
      imageUrl: `${ASSET}/scenes/inn.jpg?${V}`,
      videoUrl: `${ASSET}/scenes/inn.mp4?${V}`,
      characterIds: ["char_mira", "char_torren", "char_lira", "char_edric"],
    },
    {
      id: "scene_fragment",
      campaignId: SEED_CAMPAIGN_ID,
      sessionId: "sess_1",
      title: "The fragment still held heat",
      beat: "Sister Caldren unwraps a jagged blackened crown shard under stained-glass chapel light. Mira leans in and does not touch it. The shard still smokes.",
      kind: "moment",
      imageUrl: `${ASSET}/scenes/fragment.jpg?${V}`,
      characterIds: ["char_caldren", "char_mira"],
    },
    {
      id: "scene_barrow",
      campaignId: SEED_CAMPAIGN_ID,
      sessionId: "sess_2",
      title: "Work in the dark",
      beat: "Mira holds a choke-point in a barrow tomb, blood running from a spear-cut at the edge of her breastplate, as bone-workers press in. Torren splits a stone sarcophagus with his greataxe. Torchlight, dust, and shattered bone.",
      kind: "encounter",
      imageUrl: `${ASSET}/scenes/barrow.jpg?${V}`,
      characterIds: ["char_mira", "char_torren"],
    },
    {
      id: "scene_ridge",
      campaignId: SEED_CAMPAIGN_ID,
      sessionId: "sess_3",
      title: "The valley was already burning",
      beat: "Edric watches a burning cinder valley from a ridge at amber dusk, forest-green cloak catching the wind. Lira stands behind in burgundy robes, consulting her spellbook.",
      kind: "travel",
      imageUrl: `${ASSET}/scenes/ridge.jpg?${V}`,
      characterIds: ["char_edric", "char_lira"],
    },
    {
      id: "scene_bridge",
      campaignId: SEED_CAMPAIGN_ID,
      sessionId: "sess_3",
      title: "Someone was already waiting",
      beat: "Mira and Torren hold a crumbling stone bridge under an orange dusk sky as the Cinder Warden advances, glaive wet with blood, coal-cracks glowing in his plate.",
      kind: "encounter",
      imageUrl: `${ASSET}/scenes/bridge.jpg?${V}`,
      videoUrl: `${ASSET}/scenes/bridge.mp4?${V}`,
      characterIds: ["char_mira", "char_torren", "char_warden"],
    },
    {
      id: "scene_ward",
      campaignId: SEED_CAMPAIGN_ID,
      sessionId: "sess_3",
      title: "The ward that kept her standing",
      beat: "Lira casts a gold-white ward around Mira, who is down on one knee, blood seeping through a seam in the sunburst breastplate, ash-wind tearing across the bridge.",
      kind: "moment",
      imageUrl: `${ASSET}/scenes/ward.jpg?${V}`,
      characterIds: ["char_lira", "char_mira"],
    },
  ],
  locations: [
    {
      id: "loc_inn",
      campaignId: SEED_CAMPAIGN_ID,
      name: "The Inn at Cinderfall",
      kind: "settlement",
      description:
        "A rain-soaked roadside inn of dark timber and leaded glass. Lanterns hang over scarred oak tables. A wide hearth does most of the talking. Herbs dry from the beams. The fire-ward sigils on the hearthstones are drawn inward, slightly wrong.",
      notes:
        "The party claimed a corner table in the rain. Sister Caldren arrived after last call with a smoking bundle.",
      imageUrl: `${ASSET}/places/inn.jpg?${V}`,
      firstSeenSessionId: "sess_1",
      sessionIds: ["sess_1"],
    },
    {
      id: "loc_chapel",
      campaignId: SEED_CAMPAIGN_ID,
      name: "Chapel of the Banked Hearth",
      kind: "interior",
      description:
        "A small hill chapel of cream stone above Cinderfall. Stained glass throws ember-red and gold. Wooden pews, a simple altar, prayer beads, and a thread of smoke that does not come from candles.",
      notes:
        "Sister Caldren unwrapped the crown fragment here. She asked them not to leave it overnight.",
      imageUrl: `${ASSET}/places/chapel.jpg?${V}`,
      firstSeenSessionId: "sess_1",
      sessionIds: ["sess_1"],
    },
    {
      id: "loc_barrow",
      campaignId: SEED_CAMPAIGN_ID,
      name: "The Hollow Barrow",
      kind: "dungeon",
      description:
        "A false-mouthed hillside tomb two days east, where the grass will not grow. Inside: a choke-point corridor, a stone sarcophagus that feeds the dead, bone-workers packing ash into old armor, torchlight and dust.",
      notes:
        "Not a tomb. A bung. Mira held the line. Torren split the sarcophagus.",
      imageUrl: `${ASSET}/places/barrow.jpg?${V}`,
      firstSeenSessionId: "sess_2",
      sessionIds: ["sess_2"],
    },
    {
      id: "loc_ridge",
      campaignId: SEED_CAMPAIGN_ID,
      name: "The Cinder Ridge",
      kind: "wilderness",
      description:
        "A high ridge at amber dusk over a valley of copper fire. Dead grass. Ash-wind. The road east thins to a scratch on the hillside before it drops toward the bridge.",
      notes:
        "Edric and Lira saw the Bridge of Embers from here before the others did.",
      imageUrl: `${ASSET}/places/ridge.jpg?${V}`,
      firstSeenSessionId: "sess_3",
      sessionIds: ["sess_3"],
    },
    {
      id: "loc_bridge",
      campaignId: SEED_CAMPAIGN_ID,
      name: "The Bridge of Embers",
      kind: "landmark",
      description:
        "A crumbling stone bridge over a river that is no longer water — slow ash and banked coal. Orange dusk. Hairline cracks in the masonry glow like a grate. The far end disappears into smoke.",
      notes:
        "The Cinder Warden was already waiting in the middle of it.",
      imageUrl: `${ASSET}/places/bridge.jpg?${V}`,
      firstSeenSessionId: "sess_3",
      sessionIds: ["sess_3"],
    },
  ],
};

export const SAMPLE_TRANSCRIPT = `DM: Rain on the roof of the Inn at Cinderfall. You four are sharing a table you didn't exactly agree to share. Mira, you paid for it. Torren, you're already into the dice. Lira, you're copying something off the hearth. Edric, you're watching the door.

Mira's player: I keep my gauntlets on. I don't like the way the fire keeps popping.

Torren's player: I lose two rounds on purpose and buy them a drink. If we're stuck here we might as well not hate each other.

Lira's player: The fire-ward sigils on the stones are wrong. They're drawn inward. I write that down.

Edric's player: A woman comes in after last call. Old. Gray vestments. She's carrying something wrapped in a rag and it's smoking.

DM: Sister Caldren sets the bundle on the table. Inside is a jagged shard of a blackened crown. It is still hot. She says: "Do not wear it. Do not sell it. And do not leave it in my chapel overnight. Something under the Marches is waking, and this is a piece of the lid."

Mira's player: I don't touch it. I look at the others. "If this is a lid, then someone has to keep a hand on it."

Torren's player: I reach, stop, swear, and nod.

Lira's player: I ask her where the rest of it is.

DM: She says the Hollow Barrow, two days east, where the grass will not grow.`;
