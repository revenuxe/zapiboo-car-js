// Change this single switch when pickup operations are ready to launch.
export const servicesPaused = true;
export const openingSoonHref = "#service-opening-soon";
export function showOpeningSoon() {
  window.dispatchEvent(new Event("zapiboo:opening-soon"));
}
