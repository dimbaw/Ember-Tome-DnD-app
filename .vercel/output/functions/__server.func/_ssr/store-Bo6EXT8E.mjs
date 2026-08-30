import { n as clsx } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { n as create, t as persist } from "../_libs/zustand.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/store-Bo6EXT8E.js
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
var ASSET = "/campaign/ashen-crown";
var SEED_CAMPAIGN_ID = "camp_ashen";
var SEED = {
	campaigns: [{
		id: SEED_CAMPAIGN_ID,
		name: "The Ashen Crown",
		world: "The Cinder Marches",
		premise: "A cracked crown fragment has begun to wake the old fire under the Marches. Four companions follow its trail from a rain-soaked inn to a bridge of ash.",
		coverUrl: `${ASSET}/cover.jpg`,
		createdAt: "2026-03-14T20:00:00.000Z",
		updatedAt: "2026-04-11T23:40:00.000Z"
	}],
	characters: [
		{
			id: "char_mira",
			campaignId: SEED_CAMPAIGN_ID,
			name: "Mira Solenne",
			kind: "pc",
			race: "Human",
			classOrRole: "Paladin",
			appearance: "Human paladin woman about thirty-two, short copper-brown hair cropped at the jaw, a thin pale scar from left temple to cheekbone, pale olive skin, amber-brown eyes, tired but resolute, battered steel breastplate with a cracked sunburst relief, ash-gray wool cloak pinned with an iron clasp, leather gauntlets",
			portraitUrl: `${ASSET}/characters/mira.jpg`,
			notes: "Oath of the banked hearth. Speaks little at the table, then decides for everyone. The cracked sunburst on her breastplate is from the night her first temple burned.",
			status: "alive",
			firstSeenSessionId: "sess_1"
		},
		{
			id: "char_torren",
			campaignId: SEED_CAMPAIGN_ID,
			name: "Torren Ashvein",
			kind: "pc",
			race: "Dwarf",
			classOrRole: "Fighter",
			appearance: "Dwarf fighter man about fifty-four, stocky and barrel-chested, charcoal-black beard in two thick braids bound with iron rings, missing the tip of his left ear, storm-gray eyes, wry half-smile, weathered face with coal dust in the creases, dark iron half-plate over soot-brown leather, a massive notched greataxe",
			portraitUrl: `${ASSET}/characters/torren.jpg`,
			notes: "Ex-pit fighter from the slag towns. Claims he is only here for the coin. Stays after every fight to bury the dead.",
			status: "alive",
			firstSeenSessionId: "sess_1"
		},
		{
			id: "char_lira",
			campaignId: SEED_CAMPAIGN_ID,
			name: "Lira Quill",
			kind: "pc",
			race: "Tiefling",
			classOrRole: "Wizard",
			appearance: "Tiefling wizard woman about twenty-four, warm ochre-tan skin, two small backswept horns of polished dark horn, ink-black hair in a loose side braid, amber-gold eyes, ink-stained fingertips, curious sharp face, soot-brown wool scholar's coat with frayed cuffs, a moth-eaten leather-bound spellbook under one arm",
			portraitUrl: `${ASSET}/characters/lira.jpg`,
			notes: "Writes everything. Treats the Marches like a thesis she did not ask to live inside. Her spellbook smells of smoke even when it is closed.",
			status: "alive",
			firstSeenSessionId: "sess_1"
		},
		{
			id: "char_edric",
			campaignId: SEED_CAMPAIGN_ID,
			name: "Edric Vale",
			kind: "pc",
			race: "Half-elf",
			classOrRole: "Ranger",
			appearance: "Half-elf ranger man about twenty-eight, weathered tan skin, dark brown hair tied back with a single hawk feather, quiet moss-green eyes, lean, moss-green hooded cloak over scarred leather, leather bracers, a longbow of dark yew, three days of stubble, calm watchful expression",
			portraitUrl: `${ASSET}/characters/edric.jpg`,
			notes: "Grew up on the ridge roads. Tracks ash the way other rangers track deer. Does not sleep facing a door.",
			status: "alive",
			firstSeenSessionId: "sess_1"
		},
		{
			id: "char_caldren",
			campaignId: SEED_CAMPAIGN_ID,
			name: "Sister Caldren",
			kind: "npc",
			race: "Human",
			classOrRole: "Priestess of the Banked Hearth",
			appearance: "Elderly human priestess about seventy, white hair in a simple coil, deep-lined kind face, pale gray eyes, dusk-gray linen vestments with a faded ember-thread hem, wooden prayer bead bracelet",
			portraitUrl: `${ASSET}/characters/caldren.jpg`,
			notes: "Last keeper of the chapel above Cinderfall. She has been waiting for someone willing to carry a burning thing without wanting to wear it.",
			status: "alive",
			firstSeenSessionId: "sess_1"
		},
		{
			id: "char_warden",
			campaignId: SEED_CAMPAIGN_ID,
			name: "The Cinder Warden",
			kind: "npc",
			race: "Unknown",
			classOrRole: "Warden of the buried fire",
			appearance: "Tall armored figure in blackened iron plate etched with hairline cracks that glow faintly like banked coals, a closed helm with a single horizontal visor slit, no skin visible, a tattered cloak that hangs like smoke, gauntlets gripping a long iron glaive",
			portraitUrl: `${ASSET}/characters/warden.jpg`,
			notes: "Speaks in a voice like a grate being dragged. Claims the crown is not treasure. Claims it is a lid.",
			status: "alive",
			firstSeenSessionId: "sess_3"
		}
	],
	sessions: [
		{
			id: "sess_1",
			campaignId: SEED_CAMPAIGN_ID,
			number: 1,
			title: "The Inn at Cinderfall",
			playedOn: "2026-03-14",
			summary: "Rain kept the road closed, so four strangers shared a table at the Inn at Cinderfall and pretended they were not listening to each other. Sister Caldren arrived after last call with a rag-wrapped shard of blackened crown. It still held heat. She asked them not to wear it, not to sell it, and not to leave it in her chapel overnight. By morning the party had a name for the work, a direction into the Marches, and a quiet agreement that none of them would sleep well until the fragment was someone else's problem.",
			events: [
				{
					id: "ev_1_1",
					text: "Mira paid the innkeeper in temple coin and claimed the corner table without asking.",
					characterIds: ["char_mira"]
				},
				{
					id: "ev_1_2",
					text: "Torren lost three rounds of dice, then won the fourth by accident and bought the table a round anyway.",
					characterIds: ["char_torren"]
				},
				{
					id: "ev_1_3",
					text: "Lira copied the inn's fire-ward sigils into her book before anyone noticed they were wrong.",
					characterIds: ["char_lira"]
				},
				{
					id: "ev_1_4",
					text: "Edric watched the door for two hours and named every traveler by the mud on their boots.",
					characterIds: ["char_edric"]
				},
				{
					id: "ev_1_5",
					text: "Sister Caldren unwrapped the crown fragment. It smoked. Mira did not reach for it. Torren did, then thought better.",
					characterIds: [
						"char_caldren",
						"char_mira",
						"char_torren"
					]
				}
			],
			characterIds: [
				"char_mira",
				"char_torren",
				"char_lira",
				"char_edric",
				"char_caldren"
			],
			status: "complete",
			createdAt: "2026-03-14T23:10:00.000Z"
		},
		{
			id: "sess_2",
			campaignId: SEED_CAMPAIGN_ID,
			number: 2,
			title: "The Hollow Barrow",
			playedOn: "2026-03-28",
			summary: "Edric found the barrow by the way the grass refused to grow. Inside, the dead were not waiting so much as working — packing ash into the joints of old armor, trying to stand. Mira held the choke-point. Torren broke the sarcophagus that was feeding them. Lira named the working for what it was: a lid under strain. They left with a second fragment, a cracked rib on Mira, and the certainty that something under the Marches had noticed they were looking.",
			events: [
				{
					id: "ev_2_1",
					text: "Edric marked three false mouths in the hillside before the true barrow showed itself.",
					characterIds: ["char_edric"]
				},
				{
					id: "ev_2_2",
					text: "Mira took a spear through the edge of her breastplate and did not step back.",
					characterIds: ["char_mira"]
				},
				{
					id: "ev_2_3",
					text: "Torren split the sarcophagus lid. The bone-workers collapsed as if a string had been cut.",
					characterIds: ["char_torren"]
				},
				{
					id: "ev_2_4",
					text: "Lira traced the inward-facing runes and warned that the barrow was not a tomb. It was a bung.",
					characterIds: ["char_lira"]
				}
			],
			characterIds: [
				"char_mira",
				"char_torren",
				"char_lira",
				"char_edric"
			],
			status: "complete",
			createdAt: "2026-03-28T23:40:00.000Z"
		},
		{
			id: "sess_3",
			campaignId: SEED_CAMPAIGN_ID,
			number: 3,
			title: "The Bridge of Embers",
			playedOn: "2026-04-11",
			summary: "The road ended at a stone bridge over a river that was no longer water. The Cinder Warden was already waiting in the middle of it, glaive planted, helm shut. He called the fragments a lid and the party a set of thieves who did not know what they were unsealing. Mira answered with her oath. The fight that followed was short, ugly, and unfinished. Lira threw a pale ward around Mira when the glaive found a seam in the sunburst. The Warden stepped back into the ash-wind and was gone, leaving only the smell of a grate dragged across stone. They still have the fragments. They no longer pretend this is a fetch quest.",
			events: [
				{
					id: "ev_3_1",
					text: "Edric and Lira scouted the ridgeline at dusk and saw the bridge before the others did.",
					characterIds: ["char_edric", "char_lira"]
				},
				{
					id: "ev_3_2",
					text: "The Cinder Warden named the crown a lid and the party thieves.",
					characterIds: ["char_warden"]
				},
				{
					id: "ev_3_3",
					text: "Mira held the near end of the bridge. Torren kept the Warden's glaive from finding her throat.",
					characterIds: [
						"char_mira",
						"char_torren",
						"char_warden"
					]
				},
				{
					id: "ev_3_4",
					text: "The glaive found a seam. Lira's ward took the rest of the blow. Mira stayed on her feet.",
					characterIds: ["char_lira", "char_mira"]
				}
			],
			characterIds: [
				"char_mira",
				"char_torren",
				"char_lira",
				"char_edric",
				"char_warden"
			],
			status: "complete",
			createdAt: "2026-04-11T23:40:00.000Z"
		}
	],
	scenes: [
		{
			id: "scene_inn",
			campaignId: SEED_CAMPAIGN_ID,
			sessionId: "sess_1",
			title: "A table claimed in the rain",
			beat: "Four strangers share a scarred oak table at the Inn at Cinderfall while rain beats the leaded glass and the fire does most of the talking.",
			kind: "roleplay",
			imageUrl: `${ASSET}/scenes/inn.jpg`,
			videoUrl: `${ASSET}/scenes/inn.mp4`,
			characterIds: [
				"char_mira",
				"char_torren",
				"char_lira",
				"char_edric"
			]
		},
		{
			id: "scene_fragment",
			campaignId: SEED_CAMPAIGN_ID,
			sessionId: "sess_1",
			title: "The fragment still held heat",
			beat: "Sister Caldren unwraps a jagged blackened crown shard in the chapel light. Mira leans in and does not touch it.",
			kind: "moment",
			imageUrl: `${ASSET}/scenes/fragment.jpg`,
			characterIds: ["char_caldren", "char_mira"]
		},
		{
			id: "scene_barrow",
			campaignId: SEED_CAMPAIGN_ID,
			sessionId: "sess_2",
			title: "Work in the dark",
			beat: "Mira holds the choke-point against bone-workers while Torren splits the sarcophagus that is feeding them.",
			kind: "encounter",
			imageUrl: `${ASSET}/scenes/barrow.jpg`,
			characterIds: ["char_mira", "char_torren"]
		},
		{
			id: "scene_ridge",
			campaignId: SEED_CAMPAIGN_ID,
			sessionId: "sess_3",
			title: "The valley was already burning",
			beat: "Edric watches a cinder valley from a rain-dark ridge. Lira reads the wind in her book a few paces behind.",
			kind: "travel",
			imageUrl: `${ASSET}/scenes/ridge.jpg`,
			characterIds: ["char_edric", "char_lira"]
		},
		{
			id: "scene_bridge",
			campaignId: SEED_CAMPAIGN_ID,
			sessionId: "sess_3",
			title: "Someone was already waiting",
			beat: "Mira and Torren hold the near end of a crumbling ash-bridge as the Cinder Warden advances with a long iron glaive.",
			kind: "encounter",
			imageUrl: `${ASSET}/scenes/bridge.jpg`,
			videoUrl: `${ASSET}/scenes/bridge.mp4`,
			characterIds: [
				"char_mira",
				"char_torren",
				"char_warden"
			]
		},
		{
			id: "scene_ward",
			campaignId: SEED_CAMPAIGN_ID,
			sessionId: "sess_3",
			title: "The ward that kept her standing",
			beat: "Lira throws a pale bone-white ward around a wounded Mira as ash-wind tears across the bridge.",
			kind: "moment",
			imageUrl: `${ASSET}/scenes/ward.jpg`,
			characterIds: ["char_lira", "char_mira"]
		}
	]
};
var SAMPLE_TRANSCRIPT = `DM: Rain on the roof of the Inn at Cinderfall. You four are sharing a table you didn't exactly agree to share. Mira, you paid for it. Torren, you're already into the dice. Lira, you're copying something off the hearth. Edric, you're watching the door.

Mira's player: I keep my gauntlets on. I don't like the way the fire keeps popping.

Torren's player: I lose two rounds on purpose and buy them a drink. If we're stuck here we might as well not hate each other.

Lira's player: The fire-ward sigils on the stones are wrong. They're drawn inward. I write that down.

Edric's player: A woman comes in after last call. Old. Gray vestments. She's carrying something wrapped in a rag and it's smoking.

DM: Sister Caldren sets the bundle on the table. Inside is a jagged shard of a blackened crown. It is still hot. She says: "Do not wear it. Do not sell it. And do not leave it in my chapel overnight. Something under the Marches is waking, and this is a piece of the lid."

Mira's player: I don't touch it. I look at the others. "If this is a lid, then someone has to keep a hand on it."

Torren's player: I reach, stop, swear, and nod.

Lira's player: I ask her where the rest of it is.

DM: She says the Hollow Barrow, two days east, where the grass will not grow.`;
var useTome = create()(persist((set, get) => ({
	...SEED,
	hydrateIfEmpty: () => {
		if (get().campaigns.length === 0) set({ ...SEED });
	},
	resetToSeed: () => set({ ...SEED }),
	addCampaign: (campaign) => set((s) => ({ campaigns: [campaign, ...s.campaigns] })),
	updateCampaign: (id, patch) => set((s) => ({ campaigns: s.campaigns.map((c) => c.id === id ? {
		...c,
		...patch,
		updatedAt: (/* @__PURE__ */ new Date()).toISOString()
	} : c) })),
	addCharacter: (character) => set((s) => ({ characters: [...s.characters, character] })),
	updateCharacter: (id, patch) => set((s) => ({ characters: s.characters.map((c) => c.id === id ? {
		...c,
		...patch
	} : c) })),
	addSession: (session, scenes) => set((s) => ({
		sessions: [...s.sessions, session],
		scenes: [...s.scenes, ...scenes]
	})),
	updateSession: (id, patch) => set((s) => ({ sessions: s.sessions.map((x) => x.id === id ? {
		...x,
		...patch
	} : x) })),
	updateScene: (id, patch) => set((s) => ({ scenes: s.scenes.map((x) => x.id === id ? {
		...x,
		...patch
	} : x) })),
	addScenes: (scenes) => set((s) => ({ scenes: [...s.scenes, ...scenes] }))
}), {
	name: "ember-tome-v1",
	partialize: (s) => ({
		campaigns: s.campaigns,
		characters: s.characters,
		sessions: s.sessions,
		scenes: s.scenes
	})
}));
function sessionsFor(campaignId) {
	return useTome.getState().sessions.filter((s) => s.campaignId === campaignId).sort((a, b) => a.number - b.number);
}
function nextSessionNumber(campaignId) {
	const nums = sessionsFor(campaignId).map((s) => s.number);
	return nums.length ? Math.max(...nums) + 1 : 1;
}
//#endregion
export { useTome as i, cn as n, nextSessionNumber as r, SAMPLE_TRANSCRIPT as t };
