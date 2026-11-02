export interface SpeciesProfile {
  scientificName: string;
  description: string;
}

const speciesProfiles: Record<string, SpeciesProfile> = {
  "white-tailed-eagle": {
    scientificName: "Haliaeetus albicilla",
    description:
      "Britain’s largest bird of prey, the White-tailed Eagle is unmistakable in flight, with broad wings, a short wedge-shaped tail and a powerful projecting head. Once extinct in Scotland, it has returned through reintroduction and is now increasingly encountered around large lochs, estuaries and the north-east coast.",
  },
  wryneck: {
    scientificName: "Jynx torquilla",
    description:
      "A small, cryptically patterned member of the woodpecker family, the Wryneck feeds mainly on ants and spends much of its time on the ground. It is now a scarce passage migrant in Scotland, most often appearing in coastal scrub during spring or autumn movements.",
  },
  "red-backed-shrike": {
    scientificName: "Lanius collurio",
    description:
      "The Red-backed Shrike is a compact migrant with the hooked bill and watchful posture of a miniature bird of prey. It hunts insects and small vertebrates from exposed perches, sometimes storing prey on thorns, and is a rare but eagerly anticipated visitor to the north-east coast.",
  },
  bluethroat: {
    scientificName: "Luscinia svecica",
    description:
      "A close relative of the nightingale, the Bluethroat is best known for the male’s brilliant blue and chestnut throat pattern. Birds reaching North East Scotland are usually passage migrants from northern Europe, often found in damp coastal cover after favourable easterly winds.",
  },
  "great-grey-shrike": {
    scientificName: "Lanius excubitor",
    description:
      "Pale, long-tailed and strikingly masked, the Great Grey Shrike is a scarce winter visitor from northern Europe. It favours open woodland, moorland edges and clearings, surveying the ground from prominent perches before dropping onto insects, small birds or mammals.",
  },
  "pallass-warbler": {
    scientificName: "Phylloscopus proregulus",
    description:
      "This tiny Siberian warbler is richly marked with yellow wing bars, a bright rump and bold head stripes. Despite its distant breeding range, small numbers reach Britain each autumn, with sheltered coastal trees and scrub offering the best chance of a North East Scotland record.",
  },
  corncrake: {
    scientificName: "Crex crex",
    description:
      "More often heard than seen, the Corncrake is a secretive summer visitor whose rasping double call once characterised hay meadows across Scotland. Modern records are scarce in the north-east, where birds may pause in damp grassland and rough vegetation during migration.",
  },
  "shore-lark": {
    scientificName: "Eremophila alpestris",
    description:
      "Known elsewhere as the Horned Lark, the Shore Lark is a small ground-dwelling bird with a yellow-and-black face and tiny feathered ‘horns’. In Scotland it is a scarce winter visitor, typically feeding along quiet beaches, dunes and saltmarsh edges.",
  },
  "honey-buzzard": {
    scientificName: "Pernis apivorus",
    description:
      "The Honey Buzzard is a secretive woodland raptor adapted to feeding on the nests and larvae of wasps. Its long wings, small projecting head and elastic flight distinguish it from the Common Buzzard, although distant migrants can still be challenging to identify.",
  },
  "leachs-storm-petrel": {
    scientificName: "Hydrobates leucorhous",
    description:
      "A small ocean-going seabird with long angled wings and a deeply forked tail, Leach’s Storm Petrel spends almost all its life far from land. In North East Scotland it is most likely to be seen after severe autumn gales, which can drive exhausted birds close inshore and into harbours.",
  },
  "spotted-crake": {
    scientificName: "Porzana porzana",
    description:
      "The Spotted Crake is a small and elusive wetland rail, finely patterned with pale spots across its dark plumage. It keeps close to dense reedbeds and muddy margins, where its presence may be revealed by a rhythmic, far-carrying whistle rather than a clear view.",
  },
  hawfinch: {
    scientificName: "Coccothraustes coccothraustes",
    description:
      "Heavy-headed and powerfully billed, the Hawfinch can crack large cherry stones and other hard seeds. It is easily overlooked high in mature woodland canopies, but winter movements occasionally bring birds to wooded estates, parks and hornbeam stands in the north-east.",
  },
  "pomarine-skua": {
    scientificName: "Stercorarius pomarinus",
    description:
      "A powerful seabird of the high Arctic, the Pomarine Skua passes Scottish coasts mainly during spring and autumn migration. Adults in breeding plumage carry distinctive spoon-shaped tail streamers, while all ages may be seen pursuing gulls and gannets to steal their food.",
  },
  waxwing: {
    scientificName: "Bombycilla garrulus",
    description:
      "Waxwings are sociable winter visitors distinguished by their swept-back crests, black masks and softly coloured plumage. In irruption years, flocks move through North East Scotland in search of rowan, hawthorn and cotoneaster berries, often appearing in towns and gardens.",
  },
  "snow-bunting": {
    scientificName: "Plectrophenax nivalis",
    description:
      "The Snow Bunting is a hardy Arctic songbird associated with exposed coasts and high mountain plateaux. Scotland supports a tiny breeding population in the Cairngorms, while larger numbers arrive in winter to feed in mobile flocks along beaches, dunes and open ground.",
  },
};

export function getSpeciesProfile(slug: string): SpeciesProfile | undefined {
  return speciesProfiles[slug];
}
