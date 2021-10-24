/**
 * Functionality for basing Recoil state on URL parameters.
 *
 * While the Recoil team recommend `useSetUnvalidatedAtomValues_UNSTABLE`, I'd
 * rather base this on stable APIs until that's released.
 */

import { atom, selector } from "recoil";

/**
 * Get a parameter from the URL.
 */
const getUrlParam = <T>(
  name: string,
  defaultValue?: string
): string | undefined => {
  const currentValue = new URL(window.location.href).searchParams.get(name);
  return currentValue || defaultValue;
};

/**
 * Set a URL parameter
 */
const setUrlParam = (
  name: string,
  value: string,
  title: string = document.title
) => {
  const currentUrl = new URL(window.location.href);
  if (value.length > 0) {
    currentUrl.searchParams.set(name, value);
  } else {
    currentUrl.searchParams.delete(name);
  }
  window.history.pushState({ path: currentUrl.href }, title, currentUrl.href);
};

/**
 * Base an Atom on the current URL
 */
export const urlParamAtom = (name: string, _default: string) => {
  const state = atom({
    key: `${name}-url-param-atom`,
    default: getUrlParam(name, _default),
  });

  return selector<string | undefined>({
    key: `${name}-url-param-selector`,
    get: ({ get }) => get(state),
    set: ({ set }, value) => {
      if (typeof value !== "string") {
        return;
      }

      setUrlParam(name, value);
      set(state, value);
    },
  });
};
