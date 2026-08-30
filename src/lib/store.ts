import { create } from "zustand";
import { persist } from "zustand/middleware";
import { SEED } from "./seed";
import type {
  Campaign,
  Character,
  Location,
  Scene,
  Session,
  TomeState,
} from "./types";

type Actions = {
  hasOpenedTome: boolean;
  markTomeOpened: () => void;
  hydrateIfEmpty: () => void;
  resetToSeed: () => void;
  addCampaign: (campaign: Campaign) => void;
  updateCampaign: (id: string, patch: Partial<Campaign>) => void;
  addCharacter: (character: Character) => void;
  updateCharacter: (id: string, patch: Partial<Character>) => void;
  addLocation: (location: Location) => void;
  updateLocation: (id: string, patch: Partial<Location>) => void;
  removeLocation: (id: string) => void;
  addSession: (session: Session, scenes: Scene[]) => void;
  updateSession: (id: string, patch: Partial<Session>) => void;
  updateScene: (id: string, patch: Partial<Scene>) => void;
  addScenes: (scenes: Scene[]) => void;
  removeCharacter: (id: string) => void;
  removeScene: (id: string) => void;
  removeSession: (id: string) => void;
};

export const useTome = create<TomeState & Actions>()(
  persist(
    (set, get) => ({
      ...SEED,
      hasOpenedTome: false,
      markTomeOpened: () => set({ hasOpenedTome: true }),
      hydrateIfEmpty: () => {
        if (get().campaigns.length === 0) set({ ...SEED });
      },
      resetToSeed: () => set({ ...SEED }),
      addCampaign: (campaign) =>
        set((s) => ({ campaigns: [campaign, ...s.campaigns] })),
      updateCampaign: (id, patch) =>
        set((s) => ({
          campaigns: s.campaigns.map((c) =>
            c.id === id ? { ...c, ...patch, updatedAt: new Date().toISOString() } : c,
          ),
        })),
      addCharacter: (character) =>
        set((s) => ({ characters: [...s.characters, character] })),
      updateCharacter: (id, patch) =>
        set((s) => ({
          characters: s.characters.map((c) => (c.id === id ? { ...c, ...patch } : c)),
        })),
      addLocation: (location) =>
        set((s) => ({ locations: [...s.locations, location] })),
      updateLocation: (id, patch) =>
        set((s) => ({
          locations: s.locations.map((l) => (l.id === id ? { ...l, ...patch } : l)),
        })),
      removeLocation: (id) =>
        set((s) => ({
          locations: s.locations.filter((l) => l.id !== id),
          sessions: s.sessions.map((sess) => ({
            ...sess,
            locationIds: (sess.locationIds ?? []).filter((x) => x !== id),
          })),
        })),
      addSession: (session, scenes) =>
        set((s) => ({
          sessions: [...s.sessions, session],
          scenes: [...s.scenes, ...scenes],
        })),
      updateSession: (id, patch) =>
        set((s) => ({
          sessions: s.sessions.map((x) => (x.id === id ? { ...x, ...patch } : x)),
        })),
      updateScene: (id, patch) =>
        set((s) => ({
          scenes: s.scenes.map((x) => (x.id === id ? { ...x, ...patch } : x)),
        })),
      addScenes: (scenes) => set((s) => ({ scenes: [...s.scenes, ...scenes] })),
      removeCharacter: (id) =>
        set((s) => ({
          characters: s.characters.filter((c) => c.id !== id),
          sessions: s.sessions.map((sess) => ({
            ...sess,
            characterIds: sess.characterIds.filter((x) => x !== id),
            events: sess.events.map((e) => ({
              ...e,
              characterIds: e.characterIds.filter((x) => x !== id),
            })),
          })),
          scenes: s.scenes.map((sc) => ({
            ...sc,
            characterIds: sc.characterIds.filter((x) => x !== id),
          })),
        })),
      removeScene: (id) => set((s) => ({ scenes: s.scenes.filter((x) => x.id !== id) })),
      removeSession: (id) =>
        set((s) => ({
          sessions: s.sessions.filter((x) => x.id !== id),
          scenes: s.scenes.filter((x) => x.sessionId !== id),
          locations: s.locations.map((l) => ({
            ...l,
            sessionIds: l.sessionIds.filter((x) => x !== id),
          })),
        })),
    }),
    {
      name: "ember-tome-v3",
      partialize: (s) => ({
        campaigns: s.campaigns,
        characters: s.characters,
        sessions: s.sessions,
        scenes: s.scenes,
        locations: s.locations,
        hasOpenedTome: s.hasOpenedTome,
      }),
      merge: (persisted, current) => {
        const p = persisted as Partial<TomeState> & { hasOpenedTome?: boolean };
        return {
          ...current,
          ...p,
          locations:
            p.locations && p.locations.length > 0 ? p.locations : current.locations,
          hasOpenedTome: Boolean(p.hasOpenedTome),
        };
      },
    },
  ),
);

export function campaignById(id: string) {
  return useTome.getState().campaigns.find((c) => c.id === id);
}

export function charactersFor(campaignId: string) {
  return useTome.getState().characters.filter((c) => c.campaignId === campaignId);
}

export function sessionsFor(campaignId: string) {
  return useTome
    .getState()
    .sessions.filter((s) => s.campaignId === campaignId)
    .sort((a, b) => a.number - b.number);
}

export function scenesForSession(sessionId: string) {
  return useTome.getState().scenes.filter((s) => s.sessionId === sessionId);
}

export function nextSessionNumber(campaignId: string) {
  const nums = sessionsFor(campaignId).map((s) => s.number);
  return nums.length ? Math.max(...nums) + 1 : 1;
}
