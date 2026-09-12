export type LifeStage = 'kitten' | 'junior' | 'prime' | 'mature' | 'senior' | 'geriatric';

export type LifeStageInfo = {
  stage: LifeStage;
  label: string;
  ageRange: string;
  badgeEmoji: string;
  focus: string;
  description: string;
  dietAdvice: string;
};

export const LIFE_STAGES: Record<LifeStage, LifeStageInfo> = {
  kitten: {
    stage: 'kitten',
    label: 'Kitten',
    ageRange: '0 – 1 year',
    badgeEmoji: '🐾',
    focus: 'Rapid growth, vaccinations & socialization',
    description: 'Immense physical development and exploration. Energetic and learning boundaries.',
    dietAdvice: 'Calorie-dense kitten food with DHA for brain development. Free-feeding or multiple small meals.',
  },
  junior: {
    stage: 'junior',
    label: 'Junior',
    ageRange: '1 – 2 years',
    badgeEmoji: '🌱',
    focus: 'Transitioning to adult habits & play',
    description: 'Cat reaches full adult physical size. High curiosity, active hunting instinct.',
    dietAdvice: 'Transition to quality adult maintenance food. Monitor weight after neuter/spay.',
  },
  prime: {
    stage: 'prime',
    label: 'Prime',
    ageRange: '3 – 6 years',
    badgeEmoji: '✨',
    focus: 'Peak health & dental care routines',
    description: 'In the prime of life. Playful, stable personality, peak agility and coat quality.',
    dietAdvice: 'Balanced moisture-rich diet (wet + dry mix). Encourage hydration to protect kidneys.',
  },
  mature: {
    stage: 'mature',
    label: 'Mature',
    ageRange: '7 – 10 years',
    badgeEmoji: '🌾',
    focus: 'Weight management & baseline bloodwork',
    description: 'Slightly slower pace, more nap time. May be prone to stealthy weight gain or dental issues.',
    dietAdvice: 'High-protein, moderate-fat diet. Add joint supplements (Omega-3s) if stiffness appears.',
  },
  senior: {
    stage: 'senior',
    label: 'Senior',
    ageRange: '11 – 14 years',
    badgeEmoji: '🌿',
    focus: 'Twice-yearly vet checks, kidney & joint care',
    description: 'Cherished senior years. Needs warmer sleeping spots, easily accessible litter boxes, and calm routines.',
    dietAdvice: 'Highly digestible protein, elevated moisture, kidney-friendly phosphorus levels.',
  },
  geriatric: {
    stage: 'geriatric',
    label: 'Geriatric (Super Senior)',
    ageRange: '15+ years',
    badgeEmoji: '👑',
    focus: 'Comfort care, gentle warmth & sensory support',
    description: 'Grand masters of the couch. Vision or hearing may soften. Enjoys gentle, quiet affection.',
    dietAdvice: 'Warmed wet food to enhance aroma. Easy access to shallow food and water bowls.',
  },
};

export function calculateHumanAge(catYears: number): { humanAge: number; lifeStage: LifeStageInfo } {
  const yrs = Math.max(0.1, Number(catYears) || 0.1);
  let humanAge: number;

  if (yrs <= 0.5) {
    humanAge = Math.round(yrs * 16);
  } else if (yrs <= 1) {
    humanAge = 15;
  } else if (yrs <= 2) {
    humanAge = 24;
  } else {
    humanAge = 24 + Math.round((yrs - 2) * 4);
  }

  let stage: LifeStage = 'prime';
  if (yrs < 1) stage = 'kitten';
  else if (yrs <= 2) stage = 'junior';
  else if (yrs <= 6) stage = 'prime';
  else if (yrs <= 10) stage = 'mature';
  else if (yrs <= 14) stage = 'senior';
  else stage = 'geriatric';

  return { humanAge, lifeStage: LIFE_STAGES[stage] };
}

export type SafetyItem = {
  id: string;
  name: string;
  category: 'plant' | 'food';
  status: 'safe' | 'toxic' | 'fatal';
  commonSymptoms?: string;
  vetNote: string;
  aliases?: string[];
};

export const SAFETY_DIRECTORY: SafetyItem[] = [
  // Plants - Toxic / Fatal
  {
    id: 'lily',
    name: 'Lilies (True Lilies & Daylilies)',
    category: 'plant',
    status: 'fatal',
    commonSymptoms: 'Vomiting, lethargy, rapid acute kidney failure within 24–72 hours',
    vetNote: 'CRITICAL EMERGENCY. Even pollen grooming or drinking vase water is fatal to cats. Never bring lilies into a cat home.',
    aliases: ['Easter Lily', 'Tiger Lily', 'Daylily', 'Stargazer'],
  },
  {
    id: 'sago-palm',
    name: 'Sago Palm (Cycas revoluta)',
    category: 'plant',
    status: 'fatal',
    commonSymptoms: 'Severe vomiting, bloody stool, liver failure, seizures',
    vetNote: 'Extremely dangerous. All parts are poisonous, especially the seeds (nuts). Immediate emergency care required.',
    aliases: ['Coontie Palm', 'Cardboard Palm'],
  },
  {
    id: 'pothos',
    name: 'Pothos (Devil’s Ivy)',
    category: 'plant',
    status: 'toxic',
    commonSymptoms: 'Oral burning, excessive drooling, pawing at mouth, difficulty swallowing',
    vetNote: 'Contains insoluble calcium oxalate crystals that pierce oral tissues. Wash mouth with cool water or broth.',
    aliases: ['Golden Pothos', 'Devil\'s Ivy', 'Epipremnum'],
  },
  {
    id: 'monstera',
    name: 'Monstera Deliciosa (Swiss Cheese Plant)',
    category: 'plant',
    status: 'toxic',
    commonSymptoms: 'Intense oral irritation, swollen tongue, drooling, vomiting',
    vetNote: 'Insoluble oxalates cause burning. Keep on high plant stands out of cat jumping range.',
    aliases: ['Split-Leaf Philodendron', 'Swiss Cheese Plant'],
  },
  {
    id: 'snake-plant',
    name: 'Snake Plant (Sansevieria)',
    category: 'plant',
    status: 'toxic',
    commonSymptoms: 'Nausea, vomiting, diarrhea, excess salivation',
    vetNote: 'Contains saponins that upset the gastrointestinal system and cause bitter discomfort.',
    aliases: ['Mother-in-Law\'s Tongue', 'Sansevieria'],
  },
  {
    id: 'aloe-vera',
    name: 'Aloe Vera',
    category: 'plant',
    status: 'toxic',
    commonSymptoms: 'Vomiting, diarrhea, lethargy, tremors, change in urine color',
    vetNote: 'The yellowish latex layer contains aloin, a potent laxative and toxin for felines.',
    aliases: ['Aloe barbadensis'],
  },
  {
    id: 'tulip',
    name: 'Tulip & Daffodil Bulbs',
    category: 'plant',
    status: 'toxic',
    commonSymptoms: 'Severe gastrointestinal distress, drooling, increased heart rate, tremors',
    vetNote: 'Bulbs contain concentrated tulipalin toxins. Never let cats dig in bulb pots.',
    aliases: ['Daffodil', 'Narcissus'],
  },
  {
    id: 'peace-lily',
    name: 'Peace Lily (Spathiphyllum)',
    category: 'plant',
    status: 'toxic',
    commonSymptoms: 'Oral burning, swollen lips, drooling, vomiting',
    vetNote: 'Not a true lily (does not cause acute kidney failure like Easter lilies), but causes painful oxalate mouth sores.',
    aliases: ['Spathiphyllum'],
  },
  {
    id: 'eucalyptus',
    name: 'Eucalyptus & Essential Oils',
    category: 'plant',
    status: 'toxic',
    commonSymptoms: 'Salivation, vomiting, diarrhea, muscle weakness, respiratory distress',
    vetNote: 'Cats lack the liver enzyme (glucuronyl transferase) to process aromatic essential oils. Avoid diffusers near cats.',
    aliases: ['Tea tree oil', 'Eucalyptus oil', 'Peppermint oil'],
  },
  {
    id: 'jade-plant',
    name: 'Jade Plant (Crassula ovata)',
    category: 'plant',
    status: 'toxic',
    commonSymptoms: 'Vomiting, depression, slow heart rate, loss of coordination',
    vetNote: 'Toxicity mechanism is not fully known but causes significant neurological and GI distress.',
    aliases: ['Money Plant', 'Crassula'],
  },

  // Plants - Safe
  {
    id: 'spider-plant',
    name: 'Spider Plant (Chlorophytum comosum)',
    category: 'plant',
    status: 'safe',
    vetNote: '100% non-toxic. Has mild hallucinogenic (catnip-like) appeal to cats; may cause mild tummy upset if eaten in bulk.',
    aliases: ['Ribbon Plant', 'Airplane Plant'],
  },
  {
    id: 'cat-grass',
    name: 'Cat Grass (Oat, Wheat, Barley)',
    category: 'plant',
    status: 'safe',
    vetNote: 'Wonderfully safe and beneficial! Provides natural fiber, aids digestion, and satisfies chewing instincts.',
    aliases: ['Wheatgrass', 'Oat grass'],
  },
  {
    id: 'boston-fern',
    name: 'Boston Fern (Nephrolepis exaltata)',
    category: 'plant',
    status: 'safe',
    vetNote: 'Completely feline safe. Lush, feathery texture makes it an ideal hanging plant for cat households.',
    aliases: ['Sword Fern'],
  },
  {
    id: 'calathea',
    name: 'Calathea & Maranta (Prayer Plants)',
    category: 'plant',
    status: 'safe',
    vetNote: 'Gorgeous striped foliage that is completely non-toxic to inquisitive cats and kittens.',
    aliases: ['Prayer Plant', 'Rattlesnake Plant', 'Zebra Plant'],
  },
  {
    id: 'peperomia',
    name: 'Peperomia (Watermelon, Baby Rubber)',
    category: 'plant',
    status: 'safe',
    vetNote: 'Durable, pet-safe houseplant variety with compact rubbery leaves that cats tend to ignore.',
    aliases: ['Watermelon Peperomia', 'Radiator Plant'],
  },
  {
    id: 'areca-palm',
    name: 'Areca Palm & Parlor Palm',
    category: 'plant',
    status: 'safe',
    vetNote: 'Safe true palm variety. Perfect large statement floor plant that poses zero chemical danger to pets.',
    aliases: ['Chamaedorea elegans', 'Butterfly Palm'],
  },
  {
    id: 'orchid',
    name: 'Moth Orchid (Phalaenopsis)',
    category: 'plant',
    status: 'safe',
    vetNote: 'Non-toxic to cats. Even if a curious paw knocks off a blossom, it will not poison your cat.',
    aliases: ['Phalaenopsis'],
  },
  {
    id: 'christmas-cactus',
    name: 'Christmas / Holiday Cactus',
    category: 'plant',
    status: 'safe',
    vetNote: 'A safe holiday favorite, unlike poinsettias and mistletoe. Non-toxic, though fibrous leaves may cause mild spitting if ingested.',
    aliases: ['Thanksgiving Cactus', 'Easter Cactus', 'Schlumbergera'],
  },

  // Foods - Toxic / Fatal
  {
    id: 'garlic-onion',
    name: 'Garlic, Onions, Leeks & Chives',
    category: 'food',
    status: 'fatal',
    commonSymptoms: 'Lethargy, pale gums, elevated heart rate, reddish/brown urine',
    vetNote: 'Allium species destroy feline red blood cells (Heinz body anemia). Garlic is 5x more concentrated than onion. Never share food cooked with onion/garlic powder.',
    aliases: ['Garlic powder', 'Onion powder', 'Chives', 'Shallots'],
  },
  {
    id: 'chocolate',
    name: 'Chocolate & Cocoa',
    category: 'food',
    status: 'fatal',
    commonSymptoms: 'Hyperactivity, panting, vomiting, seizures, abnormal heart rhythm',
    vetNote: 'Theobromine and caffeine cannot be metabolized by felines. Dark chocolate and baking cocoa are the most concentrated and hazardous.',
    aliases: ['Cocoa powder', 'Dark chocolate', 'Baking chocolate'],
  },
  {
    id: 'grapes-raisins',
    name: 'Grapes & Raisins',
    category: 'food',
    status: 'toxic',
    commonSymptoms: 'Vomiting, diarrhea, refusal to eat, acute renal failure',
    vetNote: 'Tartaric acid in grapes causes severe nephrotoxicity in small animals. Keep fruit bowls covered.',
    aliases: ['Raisins', 'Sultanas', 'Currants'],
  },
  {
    id: 'xylitol',
    name: 'Xylitol (Birch Sugar)',
    category: 'food',
    status: 'fatal',
    commonSymptoms: 'Sudden hypoglycemia, staggering, collapse, liver failure',
    vetNote: 'Found in sugar-free gums, toothpastes, and diet peanut butters. Highly toxic; causes rapid insulin surge.',
    aliases: ['Birch bark extract', 'Wood sugar'],
  },
  {
    id: 'caffeine',
    name: 'Coffee, Tea & Energy Drinks',
    category: 'food',
    status: 'fatal',
    commonSymptoms: 'Restlessness, rapid breathing, heart palpitations, muscle tremors',
    vetNote: 'Feline cardiovascular systems are ultra-sensitive to methylxanthines. Clean up coffee spills immediately.',
    aliases: ['Espresso', 'Matcha', 'Caffeine pills'],
  },
  {
    id: 'cooked-bones',
    name: 'Cooked Poultry & Fish Bones',
    category: 'food',
    status: 'toxic',
    commonSymptoms: 'Gagging, bleeding mouth, internal puncture, abdominal distress',
    vetNote: 'Cooked bones splinter into razor-sharp shards that can puncture the stomach or intestines.',
    aliases: ['Chicken bones', 'Fish bones'],
  },
  {
    id: 'dairy-milk',
    name: 'Cow’s Milk & Cream',
    category: 'food',
    status: 'toxic',
    commonSymptoms: 'Diarrhea, cramps, bloating, gas within 8 hours',
    vetNote: 'Most adult cats are lactose intolerant after weaning. The storybook saucer of cow\'s milk often leads to dehydrating diarrhea.',
    aliases: ['Cheese', 'Cow milk', 'Ice cream'],
  },

  // Foods - Safe & Healthy Treats
  {
    id: 'plain-chicken',
    name: 'Plain Cooked Chicken Breast',
    category: 'food',
    status: 'safe',
    vetNote: 'The gold standard gentle treat. High-protein, low-fat. Must be boiled or baked without oils, salt, garlic, or onions.',
    aliases: ['Boiled chicken', 'Cooked turkey'],
  },
  {
    id: 'pure-pumpkin',
    name: 'Plain 100% Canned Pumpkin',
    category: 'food',
    status: 'safe',
    vetNote: 'Vet-recommended for digestion! Soluble fiber helps both constipation and loose stools. Use pure pumpkin, NEVER spiced pumpkin pie mix.',
    aliases: ['Pumpkin puree'],
  },
  {
    id: 'cooked-salmon',
    name: 'Steamed Unseasoned Salmon',
    category: 'food',
    status: 'safe',
    vetNote: 'Rich in Omega-3 fatty acids for joint health and coat luster. Always cook to eliminate parasites and remove all bones.',
    aliases: ['Cooked tuna (in water, rare treat)'],
  },
  {
    id: 'cooked-egg',
    name: 'Scrambled or Boiled Eggs (Unseasoned)',
    category: 'food',
    status: 'safe',
    vetNote: 'Great occasional protein treat. Always cook fully; raw eggs contain avidin which interferes with biotin absorption.',
    aliases: ['Hard-boiled egg'],
  },
  {
    id: 'blueberries',
    name: 'Fresh Blueberries',
    category: 'food',
    status: 'safe',
    vetNote: 'Packed with antioxidants and low in sugar. Many cats enjoy batting them around like tiny toys before nibbling.',
    aliases: ['Cranberries (plain)'],
  },
];

export type CalorieGoal = 'maintain' | 'loss' | 'gain' | 'kitten';

export type CareToolId = 'age' | 'safety' | 'hydration' | 'sitter' | 'binder' | 'lost';

export type CarePathway = {
  id: string;
  label: string;
  emoji: string;
  description: string;
  toolIds: CareToolId[];
  accent: 'mint' | 'sun' | 'blue' | 'paper';
};

/**
 * Gentle starting points for the care tools. These are orientation paths, not
 * diagnoses or care plans; each tool keeps its own educational/vet guidance.
 */
export const CARE_PATHWAYS: CarePathway[] = [
  {
    id: 'new-cat',
    label: 'New cat at home',
    emoji: '🏡',
    description: 'Get the basics in place for a kitten, adult, or newly adopted cat.',
    toolIds: ['age', 'safety', 'hydration'],
    accent: 'mint',
  },
  {
    id: 'everyday-wellness',
    label: 'Everyday wellness',
    emoji: '🌿',
    description: 'A quick check-in for food, water, safe spaces, and health notes.',
    toolIds: ['hydration', 'safety', 'binder'],
    accent: 'sun',
  },
  {
    id: 'away-from-home',
    label: 'Someone else is caring for them',
    emoji: '🧳',
    description: 'Make a clear handoff for a sitter, boarding stay, or family member.',
    toolIds: ['sitter', 'binder'],
    accent: 'blue',
  },
  {
    id: 'be-ready',
    label: 'Be ready for the unexpected',
    emoji: '🧰',
    description: 'Keep important details together and have a lost-cat plan ready.',
    toolIds: ['binder', 'lost', 'safety'],
    accent: 'paper',
  },
  {
    id: 'older-cat',
    label: 'Supporting an older cat',
    emoji: '🤍',
    description: 'Use age, hydration, and health notes as prompts for a thoughtful check-in.',
    toolIds: ['age', 'hydration', 'binder'],
    accent: 'mint',
  },
];

export function calculateCatCaloriesAndHydration(
  weightLbs: number,
  goal: CalorieGoal,
  wetPercent: number = 50
): {
  weightKg: number;
  dailyKcal: number;
  waterTotalMl: number;
  waterFromFoodMl: number;
  waterFromBowlMl: number;
  wetGramsDay: number;
} {
  const lbs = Math.max(2, Math.min(30, Number(weightLbs) || 10));
  const kg = lbs / 2.20462;

  // Resting Energy Requirement (RER)
  const rer = 70 * Math.pow(kg, 0.75);

  // Multiplier based on goal
  let multiplier = 1.2; // Neutered adult maintain
  if (goal === 'loss') multiplier = 0.9;
  if (goal === 'gain') multiplier = 1.4;
  if (goal === 'kitten') multiplier = 2.0;

  const dailyKcal = Math.round(rer * multiplier);

  // Hydration requirements: approx 50-60ml water per kg
  const waterTotalMl = Math.round(kg * 55);

  // Estimate moisture from wet vs dry food
  const wetKcal = dailyKcal * (wetPercent / 100);
  const wetGramsDay = Math.round(wetKcal); // ~1 kcal/g for wet food
  const waterFromFoodMl = Math.round(wetGramsDay * 0.78);
  const waterFromBowlMl = Math.max(10, waterTotalMl - waterFromFoodMl);

  return {
    weightKg: Math.round(kg * 10) / 10,
    dailyKcal,
    waterTotalMl,
    waterFromFoodMl,
    waterFromBowlMl,
    wetGramsDay,
  };
}
