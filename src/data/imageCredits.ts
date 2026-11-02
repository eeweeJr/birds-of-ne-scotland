export interface ImageCredit {
  author: string;
  licence: string;
  licenceUrl?: string;
  sourceUrl: string;
}

const CC_BY_2 = "https://creativecommons.org/licenses/by/2.0/";
const CC_BY_4 = "https://creativecommons.org/licenses/by/4.0/";
const CC_BY_SA_2 = "https://creativecommons.org/licenses/by-sa/2.0/";
const CC_BY_SA_3 = "https://creativecommons.org/licenses/by-sa/3.0/";
const CC_BY_SA_4 = "https://creativecommons.org/licenses/by-sa/4.0/";
const CC0 = "https://creativecommons.org/publicdomain/zero/1.0/";

const imageCredits: Record<string, ImageCredit> = {
  "white-tailed-eagle": {
    author: "Bohuš Číčel",
    licence: "CC BY-SA 3.0",
    licenceUrl: CC_BY_SA_3,
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Haliaeetus_albicilla_1_(Bohu%C5%A1_%C4%8C%C3%AD%C4%8Del).jpg",
  },
  wryneck: {
    author: "Sumeet Moghe",
    licence: "CC BY-SA 3.0",
    licenceUrl: CC_BY_SA_3,
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Eurasian_Wryneck_(cropped).jpg",
  },
  "red-backed-shrike": {
    author: "Zeynel Cebeci",
    licence: "CC BY-SA 4.0",
    licenceUrl: CC_BY_SA_4,
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Lanius_collurio_-_Red-backed_Shrike_03.jpg",
  },
  "great-grey-shrike": {
    author: "Mike Prince",
    licence: "CC BY 2.0",
    licenceUrl: CC_BY_2,
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Great_Grey_Shrike_(50862509872).jpg",
  },
  "pallass-warbler": {
    author: "Francesco Veronesi",
    licence: "CC BY-SA 2.0",
    licenceUrl: CC_BY_SA_2,
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Pallas%27s_Leaf_Warbler,_Treviso,_Veneto,_Italy_S4E1751_(19261546342).jpg",
  },
  "shore-lark": {
    author: "JerryFriedman",
    licence: "CC BY-SA 3.0",
    licenceUrl: CC_BY_SA_3,
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Eremophila_alpestris3.jpg",
  },
  "honey-buzzard": {
    author: "Jo Kurz",
    licence: "CC BY-SA 3.0",
    licenceUrl: CC_BY_SA_3,
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Pernis_apivorus2.jpg",
  },
  "leachs-storm-petrel": {
    author: "Alexis Lours",
    licence: "CC BY 4.0",
    licenceUrl: CC_BY_4,
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Leach%27s_Storm-petrel_Saint-Jean-de-Monts_04.jpg",
  },
  "spotted-crake": {
    author: "Marek Szczepanek",
    licence: "CC BY-SA 3.0",
    licenceUrl: CC_BY_SA_3,
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Porzana_porzana_1_(Marek_Szczepanek).jpg",
  },
  hawfinch: {
    author: "Dellex",
    licence: "CC BY-SA 4.0",
    licenceUrl: CC_BY_SA_4,
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:0_Kernbei%C3%9Fer_M%C3%A4nnchen.jpg",
  },
  "pomarine-skua": {
    author: "Russ Namitz",
    licence: "CC0 1.0",
    licenceUrl: CC0,
    sourceUrl: "https://www.inaturalist.org/observations/335320653",
  },
  waxwing: {
    author: "Thompson Hyggen",
    licence: "CC0 1.0",
    licenceUrl: CC0,
    sourceUrl: "https://www.inaturalist.org/observations/106691654",
  },
  bluethroat: {
    author: "Valeria Kovaleva",
    licence: "CC BY 4.0",
    licenceUrl: CC_BY_4,
    sourceUrl: "https://www.inaturalist.org/observations/88521774",
  },
  corncrake: {
    author: "Konstantin Seliverstov",
    licence: "CC BY 4.0",
    licenceUrl: CC_BY_4,
    sourceUrl: "https://www.inaturalist.org/observations/36059934",
  },
  "snow-bunting": {
    author: "Mikhail Malyshev",
    licence: "CC BY 4.0",
    licenceUrl: CC_BY_4,
    sourceUrl: "https://www.inaturalist.org/observations/201274186",
  },
};

export function getImageCredit(slug: string): ImageCredit | undefined {
  return imageCredits[slug];
}

export function getAllImageCredits(): [string, ImageCredit][] {
  return Object.entries(imageCredits);
}
