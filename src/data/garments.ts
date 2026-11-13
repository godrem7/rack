import front01 from '@/src/assets/garments/front_01.png';
import front02 from '@/src/assets/garments/front_02.png';
import front03 from '@/src/assets/garments/front_03.png';
import front04 from '@/src/assets/garments/front_04.png';
import front05 from '@/src/assets/garments/front_05.png';
import front06 from '@/src/assets/garments/front_06.png';
import front07 from '@/src/assets/garments/front_07.png';

import side01 from '@/src/assets/garments/side_01.png';
import side02 from '@/src/assets/garments/side_02.png';
import side03 from '@/src/assets/garments/side_03.png';
import side04 from '@/src/assets/garments/side_04.png';
import side05 from '@/src/assets/garments/side_05.png';
import side06 from '@/src/assets/garments/side_06.png';
import side07 from '@/src/assets/garments/side_07.png';

export type GarmentAvailability = 'Available' | 'Low Stock' | 'Archive Only';

export interface GarmentPiece {
  id: string;
  indexLabel: string;
  title: string;
  colorway: string;
  category: 'Short Sleeve' | 'Heavy Fleece' | 'Long Sleeve';
  fabricSpec: string;
  printTechnique: string;
  editionSize: number;
  remainingUnits: number;
  availability: GarmentAvailability;
  year: string;
  notes: string;
  sizes: string[];
  frontImage: string;
  sideImage: string;
  altFront: string;
  altSide: string;
  swatchHex: string;
}

export const STUDIO_GARMENTS: GarmentPiece[] = [
  {
    id: 'earthwash-artisan-tee',
    indexLabel: '01',
    title: 'Earthwash Artisan Tee',
    colorway: 'Mineral Umber',
    category: 'Short Sleeve',
    fabricSpec: '260 GSM Combed Ring-Spun Jersey',
    printTechnique: 'Discharge Tonal Chest Print',
    editionSize: 120,
    remainingUnits: 28,
    availability: 'Available',
    year: '2026',
    notes:
      'Enzyme-washed boxy silhouette dyed in small vats for subtle seam variation, finished with a tonal cream discharge wordmark.',
    sizes: ['S', 'M', 'L', 'XL'],
    frontImage: front01,
    sideImage: side01,
    altFront: 'Front view of mineral umber washed cotton t-shirt on a walnut wooden hanger',
    altSide: 'Side profile of mineral umber t-shirt hanging on rail',
    swatchHex: '#574337',
  },
  {
    id: 'obsidian-studio-tee',
    indexLabel: '02',
    title: 'Obsidian Emblem Tee',
    colorway: 'Pitch Black',
    category: 'Short Sleeve',
    fabricSpec: '280 GSM Heavyweight Organic Cotton',
    printTechnique: 'High-Density Matte Waterbase Ink',
    editionSize: 150,
    remainingUnits: 42,
    availability: 'Available',
    year: '2026',
    notes:
      'Structured drop-shoulder block cut in dry-hand 280 GSM cotton with a crisp left-chest geometric studio mark.',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    frontImage: front02,
    sideImage: side02,
    altFront: 'Front view of pitch black heavyweight t-shirt with small chest emblem on walnut hanger',
    altSide: 'Side profile of pitch black t-shirt hanging on rail',
    swatchHex: '#1A1A1B',
  },
  {
    id: 'wild-flora-study-tee',
    indexLabel: '03',
    title: 'Wild Flora Monograph Tee',
    colorway: 'Natural Chalk',
    category: 'Short Sleeve',
    fabricSpec: '260 GSM Unbleached Cotton Jersey',
    printTechnique: '6-Screen Halftone Botanical Print',
    editionSize: 85,
    remainingUnits: 6,
    availability: 'Low Stock',
    year: '2026',
    notes:
      'Herbarium study pressed onto unbleached chalk jersey using six water-based separation screens for soft zero-hand feel.',
    sizes: ['S', 'M', 'L'],
    frontImage: front03,
    sideImage: side03,
    altFront: 'Front view of natural chalk t-shirt with pressed wildflower botanical print on walnut hanger',
    altSide: 'Side profile of natural chalk t-shirt hanging on rail',
    swatchHex: '#F2EFE7',
  },
  {
    id: 'deep-forest-crewneck',
    indexLabel: '04',
    title: 'Deep Forest Loopback Crew',
    colorway: 'Pine Canopy',
    category: 'Heavy Fleece',
    fabricSpec: '420 GSM French Terry Loopback',
    printTechnique: 'Puff-Base Heritage Serif Screenprint',
    editionSize: 75,
    remainingUnits: 14,
    availability: 'Available',
    year: '2026',
    notes:
      'Cross-grain side-gusset crewneck knitted at 420 GSM with double-rib cuffs and warm cream chest typography.',
    sizes: ['S', 'M', 'L', 'XL'],
    frontImage: front04,
    sideImage: side04,
    altFront: 'Front view of deep pine green heavyweight crewneck sweatshirt on walnut hanger',
    altSide: 'Side profile of deep pine green crewneck sweatshirt hanging on rail',
    swatchHex: '#1D3F33',
  },
  {
    id: 'axonometric-longsleeve',
    indexLabel: '05',
    title: 'Axonometric Pavilion Longsleeve',
    colorway: 'Jet Obsidian',
    category: 'Long Sleeve',
    fabricSpec: '275 GSM Carded Cotton Jersey',
    printTechnique: 'Fine-Line Metallic White Screenprint',
    editionSize: 90,
    remainingUnits: 0,
    availability: 'Archive Only',
    year: '2025',
    notes:
      'Architectural elevation linework printed at 305-mesh precision across heavyweight jet-black long-sleeve jersey.',
    sizes: ['M', 'L'],
    frontImage: front05,
    sideImage: side05,
    altFront: 'Front view of jet black long-sleeve shirt with white architectural line drawing on walnut hanger',
    altSide: 'Side profile of jet black long-sleeve shirt hanging on rail',
    swatchHex: '#171718',
  },
  {
    id: 'botanical-type-tee',
    indexLabel: '06',
    title: 'Botanical Collective Tee',
    colorway: 'Warm Bone',
    category: 'Short Sleeve',
    fabricSpec: '260 GSM Open-End Boxy Jersey',
    printTechnique: 'Two-Pass Sage & Charcoal Overprint',
    editionSize: 100,
    remainingUnits: 19,
    availability: 'Available',
    year: '2026',
    notes:
      'Soft sage botanical engraving layered beneath crisp serif display type on relaxed warm-bone cotton.',
    sizes: ['S', 'M', 'L', 'XL'],
    frontImage: front06,
    sideImage: side06,
    altFront: 'Front view of warm bone t-shirt with botanical engraving and charcoal serif type on walnut hanger',
    altSide: 'Side profile of warm bone t-shirt hanging on rail',
    swatchHex: '#EFECE2',
  },
  {
    id: 'concrete-pocket-tee',
    indexLabel: '07',
    title: 'Concrete Utility Pocket Tee',
    colorway: 'Architectural Slate',
    category: 'Short Sleeve',
    fabricSpec: '290 GSM Heavy Pique-Jersey',
    printTechnique: 'Unprinted · Garment-Dyed Finish',
    editionSize: 140,
    remainingUnits: 33,
    availability: 'Available',
    year: '2026',
    notes:
      'Clean daily studio uniform piece with reinforced chest pocket, blind-stitched hems, and subtle tonal garment dye.',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    frontImage: front07,
    sideImage: side07,
    altFront: 'Front view of slate grey heavyweight pocket t-shirt on walnut hanger',
    altSide: 'Side profile of slate grey pocket t-shirt hanging on rail',
    swatchHex: '#828487',
  },
];
