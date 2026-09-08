export type StoryAccent = 'main' | 'sun' | 'blue' | 'mint' | 'coral';

export type JournalEntry = {
  id: string;
  category: string;
  readTime: string;
  title: string;
  dek: string;
  body: string[];
  tone: 'paper' | 'sun' | 'mint' | 'coral' | 'blue';
};

export const featuredStories: JournalEntry[] = [
  {
    id: 'notice-the-small-things',
    category: 'Care note',
    readTime: '6 min read',
    title: 'The quiet art of noticing a change',
    dek: 'Small observations that make a vet visit more useful — and everyday care feel less mysterious.',
    body: [
      'This is about building a habit of noticing, not about diagnosing anything at home. Any change that concerns you is worth a call to your vet — the goal here is to help you notice sooner and describe it better, nothing more.',
      'Most of the meaningful changes in a cat’s health show up first as small shifts in habit, long before anything looks like an emergency. The goal of a regular check-in isn’t to become an amateur vet — it’s to become a better reporter, so that when you do talk to a professional, you can answer more than “she’s just been off lately.”',
      'Start with water and food, since both are easy to track without much effort. Has the water bowl been emptying faster than it used to? Has your cat gone from finishing meals eagerly to picking at them, or the reverse — suddenly ravenous in a way that feels new? Either direction is worth a mental note, and a mention at the next visit if it persists more than a few days.',
      'Litter box habits are one of the most useful and most overlooked signals. Straining, more frequent visits, a noticeably larger or smaller output, or a sudden change in preferred spot can all point to something worth investigating. Scooping daily pays off twice — once for a clean house, once for actually noticing.',
      'Watch how they move, especially getting up and down from favorite high spots. A cat who used to leap onto the counter and now takes the chair as a stepping stone isn’t necessarily in pain, but it’s exactly the kind of gradual change that’s easy to miss day-to-day and obvious in hindsight.',
      'Grooming is another quiet indicator. Cats are fastidious by nature, so a coat that’s started looking a little unkempt or greasy can be one of the first outward signs that something feels off to them, even before you can point to what.',
      'None of this on its own is cause for alarm. The point of paying attention during normal moments is building a baseline, so that when something does shift, you notice faster and can describe it more clearly. “She’s been drinking more for about two weeks and jumping less” gets you a far more useful appointment than “she seems different.”',
    ],
    tone: 'paper',
  },
  {
    id: 'nightly-reset',
    category: 'Home',
    readTime: '7 min read',
    title: 'The 10-minute nightly reset your cat actually notices',
    dek: 'It is less about a perfect routine and more about a few repeatable signals: a fresh bowl, a soft landing spot, and a room that settles down with them.',
    body: [
      'Most advice about evening routines with a cat assumes you have more time, more discipline, or a tidier home than you actually have. Ten minutes is the honest budget. Here is what to spend it on.',
      'Start with the water — not because the current bowl is dirty, but because a fresh pour is one of the easiest signals you can give that the day is winding down. Cats notice small, repeated things far more than big, occasional ones. A clean bowl every night becomes a marker in their internal clock, the same way dimming a lamp is one for yours.',
      'Next, a quick food top-off and bowl wipe. If you feed on a schedule, a predictable last feeding gives the rest of the house permission to quiet down. Restless cats at 2 a.m. are often just cats who don’t know when “later” is.',
      'Then check the sleeping spots — not to rearrange them, but to make sure they still make sense. A blanket slid off a favorite perch, a sunny window seat gone cold after dark, a bed too close to a noisy vent: small frictions that don’t bother you but quietly bother them. Fixing one takes fifteen seconds.',
      'Litter box: a quick scoop, every night, no exceptions. It’s the one item on this list that’s easy to skip when you’re tired, and the one most likely to matter. A box that’s fine in the morning is often not fine by 9 p.m., and a cat who avoids a dirty box doesn’t complain — they just quietly start using something else.',
      'Last, dim a light or two before you head to bed yourself. It won’t stop 3 a.m. zoomies entirely — nothing does — but a house that visibly settles down, room by room, gives a clear cue to wind down too.',
      'None of this requires new gear or a strict schedule. It requires doing five small things in the same order most nights, so your cat can predict what comes next. Cats aren’t asking for much. They’re asking for the evening to make sense.',
    ],
    tone: 'sun',
  },
  {
    id: 'scratcher-belongs-here',
    category: 'Field note',
    readTime: '5 min read',
    title: 'A scratcher that belongs in the living room',
    dek: 'What a good cat object has in common with good furniture: stability, honest materials, and smart placement.',
    body: [
      'Most scratching posts fail on one of two fronts: they’re stable but ugly, or attractive but wobbly enough that one enthusiastic scratch sends the whole thing sliding across the floor. A post that tips over once rarely gets a second chance — it’s now a thing that moves unpredictably, which is disqualifying for an animal that values predictability above almost everything else.',
      'Stability starts at the base. Anything under about 16 inches across tends to tip under a full-body stretch-scratch, especially from larger cats. Weight matters more than footprint — a heavier, lower-profile base beats a wide but flimsy one nearly every time.',
      'Surface matters just as much, and preferences vary more than manufacturers admit. Wound sisal rope tends to hold up best and gives the resistance most cats seem to prefer for a deep stretch-scratch. Cardboard is a fine secondary surface — cheap and satisfying — but shreds faster and works better as a horizontal scratcher than a vertical post.',
      'Height is worth planning around your specific cat rather than buying the tallest option by default. A full-stretch cat needs a post tall enough to extend completely without back paws leaving the ground — usually 30 to 36 inches for an average adult, more for larger breeds.',
      'Placement decides adoption more than the post itself. A great post tucked in a spare room nobody spends time in gets ignored in favor of the arm of the couch, which is exactly where the cat already knows people gather. Put a new post near wherever the “problem” scratching already happens, not somewhere tidier and more out of the way.',
      'Watch for a few days before deciding a post “didn’t work.” Cats test new furniture on their own schedule, not yours — and the best sign of acceptance isn’t that it looks used, it’s that it looks used the way your specific cat actually scratches.',
    ],
    tone: 'mint',
  },
];

export const practicalGuides: JournalEntry[] = [
  {
    id: 'litter-box-placement',
    category: 'Home',
    readTime: '6 min read',
    title: 'The quiet art of litter-box placement',
    dek: 'A calmer corner starts with how the room feels, not just where the box physically fits.',
    body: [
      'Litter box placement gets treated like a furniture problem — where does it physically fit — when it’s really a comfort problem. Cats choose or avoid a box based on how safe and predictable the spot feels, not how convenient it is for you.',
      'The single biggest mistake is a loud or high-traffic spot: next to a washing machine, behind a door that gets slammed, in a hallway everyone cuts through. A cat mid-business has limited escape routes, and a startling noise at the wrong moment can sour a location permanently.',
      'Corners are usually better than open floor space, but not corners that feel like dead ends — a cat wants to see the room, not just a wall. If the only available spot boxes them in with their back to the door, angle the box so they can watch the entry while they use it.',
      'Multiply your boxes if you have multiple cats, and even if you don’t: one box per cat plus one extra, spread across more than one location if your home allows it. This gives a cat options, so a single bad experience in one spot doesn’t take out their only bathroom.',
      'Lighting matters more than people expect. A pitch-dark closet might feel private to you but disorienting to them, especially for older cats with declining night vision. A small night-light nearby tends to work better than true darkness.',
      'Finally, resist moving a working setup for your own convenience all at once. If a box has been reliably used for months, move it a foot or two every few days rather than across the house overnight. Cats build accumulated trust in a location, and that trust doesn’t transfer just because the new spot is objectively nicer by human standards.',
    ],
    tone: 'coral',
  },
  {
    id: 'senior-cat-checkin',
    category: 'Care note',
    readTime: '8 min read',
    title: 'A no-drama guide to the senior-cat check-in',
    dek: 'Small observations that help you arrive at the veterinary clinic with clear, helpful context.',
    body: [
      'This article shares general observation habits, not medical advice. Any change that concerns you is worth a call to your vet — this is about noticing sooner, not diagnosing at home.',
      'Older cats are quiet about a lot. Most of the meaningful changes in a senior cat’s health show up first as small shifts in habit, long before anything looks like an emergency. The goal of a regular check-in isn’t to become an amateur vet — it’s to become a better reporter, so that when you do talk to a professional, you can answer more than “he’s just been off lately.”',
      'Start with water and food, since both are easy to track without much effort. Has the water bowl been emptying faster than it used to? Has your cat gone from finishing meals eagerly to picking at them, or the reverse — suddenly ravenous in a way that feels new? Either direction is worth a mental note and, if it persists more than a few days, a mention at the next visit.',
      'Litter box habits are one of the most useful and most overlooked signals. Straining, more frequent visits, noticeably larger or smaller output, or a sudden change in litter box location preference can all point to something worth investigating. This is one area where scooping daily pays off twice — once for a clean house, once for actually noticing.',
      'Watch how they move, especially getting up and down from favorite high spots. A cat who used to leap onto the counter and now takes the chair as a stepping stone isn’t necessarily in pain, but it’s exactly the kind of gradual change that’s easy to miss day-to-day and obvious in hindsight.',
      'Grooming is another quiet indicator. Cats are fastidious by nature, so a coat that’s started looking a little unkempt, matted, or greasy can be one of the first outward signs that something feels off to them, even before you can point to what.',
      'Sociability shifts count too — more time hiding, less interest in normal routines, a sudden new clinginess, or the opposite. Cats don’t narrate discomfort. They just quietly change what they do.',
      'None of these on its own is cause for alarm. The point of a regular, low-key check-in — really just paying attention during normal moments, not a formal exam — is building a baseline, so that when something does shift, you notice faster and can describe it more clearly.',
    ],
    tone: 'paper',
  },
  {
    id: 'better-hosts',
    category: 'Field note',
    readTime: '5 min read',
    title: 'Why cat people make better hosts',
    dek: 'Design cues from the most considerate homes we have visited.',
    body: [
      'There’s a particular kind of home that’s easy to spot once you know what you’re looking for: nothing about it screams “cat owner,” and yet everything about it was clearly designed with one in mind. No looming cat tree parked in the middle of the living room, no litter box announcing itself at the door — just a house that happens to work exceptionally well for the person and the cat living in it.',
      'That instinct — designing for comfort you don’t have to explain — turns out to make people better hosts generally, not just better cat owners.',
      'Take vertical space. A shelf-and-perch setup built for a cat to survey the room from above often does double duty as genuinely nice shelving, giving a living room more visual interest than a wall of framed prints alone. Guests don’t clock it as “cat furniture.” They clock it as a nice room.',
      'Or consider the quiet retreat spot every good multi-cat home seems to have: a low-traffic corner where an overwhelmed cat can disappear during a party. That same instinct — having somewhere calm to send someone who needs a break from the noise — is exactly what makes a home comfortable for an anxious guest or an overstimulated kid.',
      'There’s also a specific thoughtfulness around food and mess. Hosts who’ve spent years managing a cat’s relationship with the kitchen counter tend to be unusually good at keeping prep areas genuinely clean and unattended-snack-proof, a habit guests appreciate for entirely unrelated reasons.',
      'None of this is really about the cat. It’s about what living with one, closely and for years, teaches you about designing a space — and a welcome — that works for everyone in it, including the ones who can’t ask for what they need out loud.',
    ],
    tone: 'sun',
  },
  {
    id: 'seven-day-enrichment',
    category: 'Gentle guide',
    readTime: '7 days',
    title: 'A seven-day enrichment reset',
    dek: 'One small change a day, designed for real homes and cats with strong opinions.',
    body: [
      'Day one: rotate one toy back into view. Day two: offer a paper bag with the handles removed. Day three: make a sunny resting spot more comfortable. Day four: scatter a few pieces of regular food for a tiny supervised search.',
      'Day five: place a scratcher near a well-used route. Day six: take three calm minutes to play with a wand toy, then let the “prey” be caught. Day seven: do less and notice what your cat chose.',
      'Enrichment is not a performance. Familiarity, choice, and a little novelty are usually plenty.',
    ],
    tone: 'mint',
  },
  {
    id: 'tiny-apartment-territory',
    category: 'Home',
    readTime: '4 min read',
    title: 'Make an apartment feel bigger to a cat',
    dek: 'Territory is not just square footage; it is paths, perches, routines, and a few good choices.',
    body: [
      'Look for vertical opportunities first: a stable window perch, a cleared top of a bookcase if safe, or a cat tree placed where people already gather. Then make routes between resting spots feel easy rather than blocked.',
      'Spread important things out when you can. Water, rest, scratching, and play do not need to happen in one crowded corner.',
      'Small spaces benefit from fewer, better objects. A cat who can choose between two familiar places is already gaining territory.',
    ],
    tone: 'coral',
  },
];

export const weeklyPrompt = {
  label: 'This week’s open question',
  title: 'What tiny routine makes your cat feel most at home?',
  detail: 'A blanket folded just right? The evening window check? Tell the club about the small thing that seems to say: you belong here.',
};
