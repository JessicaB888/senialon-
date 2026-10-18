// Configuración confirmada por el usuario; no son canales consultados.
export const expectedCorpus = [
  "https://www.youtube.com/@30X_by_Andres_Bilbao",
  "https://www.youtube.com/@30XDevs",
  "https://www.youtube.com/@Platzi",
  "https://www.youtube.com/@EloisaWolf",
  "https://www.youtube.com/@manuelavillegas",
  "https://www.youtube.com/@Gartnervideo",
  "https://www.youtube.com/@AdrianSaenz",
  "https://www.youtube.com/@EDteam",
  "https://www.youtube.com/@KimiMoonshot",
  "https://www.youtube.com/user/TheRANDCorporation",
  "https://www.youtube.com/channel/UChugFTK0KyrES9terTid8vA",
] as const;

export function sourceLabel(url: string): string {
  return url.includes("/channel/")
    ? `Canal ${url.split("/").at(-1)}`
    : (url.split("/").at(-1) ?? url);
}
