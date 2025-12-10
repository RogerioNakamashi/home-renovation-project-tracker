import createCache from "@emotion/cache";

// prepend: true moves MUI styles to the top of the <head> for correct priority
export default function createEmotionCache() {
  return createCache({ key: "mui", prepend: true });
}
