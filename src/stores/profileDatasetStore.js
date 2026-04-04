import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

const STORAGE_KEY = "instagram-profile-dataset";

/**
 * @typedef {Object} ProfileDatasetState
 * @property {Record<string, unknown>[]} rawProfiles
 * @property {string                        } fileLabel
 * @property {number[]                      } urlClickedRowIndexes
 * @property {(records: Record<string, unknown>[], fileName: string) => void} setDataset
 * @property {(index: number) => void} addUrlClickedRow
 */

export const useProfileDatasetStore = create(
  persist(
    (set) => ({
      rawProfiles: /** @type {Record<string, unknown>[]} */ ([]),
      fileLabel: "",
      urlClickedRowIndexes: /** @type {number[]} */ ([]),

      /**
       * Replace dataset (e.g. new upload). Clears URL row highlights and overwrites persisted storage.
       */
      setDataset: (records, fileName) => {
        if (typeof localStorage !== "undefined") {
          localStorage.removeItem(STORAGE_KEY);
        }
        set({
          rawProfiles: records,
          fileLabel: fileName,
          urlClickedRowIndexes: [],
        });
      },

      addUrlClickedRow: (index) =>
        set((state) => ({
          urlClickedRowIndexes: state.urlClickedRowIndexes.includes(index)
            ? state.urlClickedRowIndexes
            : [...state.urlClickedRowIndexes, index],
        })),
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        rawProfiles: state.rawProfiles,
        fileLabel: state.fileLabel,
        urlClickedRowIndexes: state.urlClickedRowIndexes,
      }),
    },
  ),
);
