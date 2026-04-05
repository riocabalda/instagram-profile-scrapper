import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

const FOLLOWERS_FILTER_STORAGE_KEY = "instagram-followers-filter";

/**
 * @typedef {Object} FollowersFilterState
 * @property {number} followersCountMin
 * @property {number} followersCountMax
 * @property {(min: number) => void} setFollowersCountMin
 * @property {(max: number) => void} setFollowersCountMax
 * @property {(min: number, max: number) => void} setFollowersCountRange
 */

export const useFollowersFilterStore = create(
  persist(
    (set) => ({
      followersCountMin: 500,
      followersCountMax: 100000,

      setFollowersCountMin: (min) =>
        set({ followersCountMin: Math.max(0, min) }),

      setFollowersCountMax: (max) =>
        set({ followersCountMax: Math.max(0, max) }),

      setFollowersCountRange: (min, max) =>
        set({
          followersCountMin: Math.max(0, min),
          followersCountMax: Math.max(0, max),
        }),
    }),
    {
      name: FOLLOWERS_FILTER_STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        followersCountMin: state.followersCountMin,
        followersCountMax: state.followersCountMax,
      }),
    },
  ),
);
