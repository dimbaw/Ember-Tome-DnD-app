export type CharacterKind = "pc" | "npc";
export type CharacterStatus = "alive" | "dead" | "unknown";
export type SceneKind = "moment" | "encounter" | "travel" | "roleplay";
export type SessionStatus = "processing" | "complete";
export type MediaSource = "seed" | "upload" | "ai";
export type MediaKind = "image" | "video";
export type LocationKind =
  | "settlement"
  | "interior"
  | "dungeon"
  | "wilderness"
  | "landmark";

export type MediaVersion = {
  id: string;
  url: string;
  createdAt: string;
  source: MediaSource;
};

export type GalleryItem = MediaVersion & {
  kind: MediaKind;
};

export type Campaign = {
  id: string;
  name: string;
  world: string;
  premise: string;
  coverUrl: string;
  coverHistory?: MediaVersion[];
  coverVideoUrl?: string;
  coverVideoHistory?: MediaVersion[];
  createdAt: string;
  updatedAt: string;
};

export type Character = {
  id: string;
  campaignId: string;
  name: string;
  kind: CharacterKind;
  race: string;
  classOrRole: string;
  appearance: string;
  portraitUrl: string;
  portraitHistory?: MediaVersion[];
  gallery?: GalleryItem[];
  notes: string;
  status: CharacterStatus;
  firstSeenSessionId: string | null;
};

export type Location = {
  id: string;
  campaignId: string;
  name: string;
  kind: LocationKind;
  description: string;
  notes: string;
  imageUrl: string;
  imageHistory?: MediaVersion[];
  videoUrl?: string;
  videoHistory?: MediaVersion[];
  firstSeenSessionId: string | null;
  sessionIds: string[];
};

export type Scene = {
  id: string;
  campaignId: string;
  sessionId: string;
  title: string;
  beat: string;
  kind: SceneKind;
  imageUrl: string;
  videoUrl?: string;
  imageHistory?: MediaVersion[];
  videoHistory?: MediaVersion[];
  characterIds: string[];
};

export type SessionEvent = {
  id: string;
  text: string;
  characterIds: string[];
};

export type Session = {
  id: string;
  campaignId: string;
  number: number;
  title: string;
  playedOn: string;
  summary: string;
  transcript?: string;
  events: SessionEvent[];
  characterIds: string[];
  locationIds?: string[];
  status: SessionStatus;
  createdAt: string;
};

export type TomeState = {
  campaigns: Campaign[];
  characters: Character[];
  sessions: Session[];
  scenes: Scene[];
  locations: Location[];
};
