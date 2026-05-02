/**
 * electionData.js
 * Central data store for all Indian election education content.
 * All content is sourced from official ECI publications and the
 * Representation of the People Act, 1951.
 */

// ── Election Process Steps ────────────────────────────────────────────────────
export const ELECTION_STEPS = [
  {
    id: 1,
    title: 'Election Announcement',
    subtitle: 'Schedule & Model Code of Conduct',
    icon: '📢',
    color: '#FF6200',
    description:
      'The Election Commission of India (ECI) announces the election schedule. The Model Code of Conduct (MCC) comes into effect immediately on announcement.',
    details: [
      'ECI issues a Press Note with all polling dates and phases',
      'Model Code of Conduct (MCC) becomes active at the same moment',
      'Political parties and candidates must follow MCC rules strictly',
      'Government cannot announce new welfare schemes during MCC period',
      'Ruling party cannot use government machinery for campaigning',
    ],
    fact: 'The ECI is an independent constitutional body set up under Article 324. It has operated since January 25, 1950 — a day now celebrated as National Voters Day.',
  },
  {
    id: 2,
    title: 'Voter Registration',
    subtitle: 'Enrol on the Electoral Roll',
    icon: '📋',
    color: '#2E86AB',
    description:
      'Every Indian citizen aged 18 or above can register as a voter. You need to be on the Electoral Roll to vote. Registration is free.',
    details: [
      'Must be an Indian citizen, 18 years or older',
      'Register online at voters.eci.gov.in using Form 6',
      'Or visit your local Booth Level Officer (BLO) in person',
      'Documents needed: age proof, address proof, passport photo',
      'Voter ID card (EPIC) is issued after verification',
      'Check your name on the electoral roll before election day',
    ],
    fact: 'As of 2024, India has over 968 million registered voters — the largest electorate in the world. Every year on January 25, new 18-year-olds are encouraged to register.',
  },
  {
    id: 3,
    title: 'Nomination of Candidates',
    subtitle: 'Filing & Scrutiny',
    icon: '📝',
    color: '#A23B72',
    description:
      'Candidates file nomination papers with the Returning Officer (RO). A security deposit is required. Nominations are then scrutinised for validity.',
    details: [
      'Candidate submits Form 2B (nomination paper) to the Returning Officer',
      'Security deposit: ₹25,000 for Lok Sabha (₹12,500 for SC/ST candidates)',
      'Must submit a sworn affidavit disclosing assets, criminal record, education',
      'Returning Officer scrutinises all nominations for legal validity',
      'Candidates may withdraw within the last date for withdrawal',
      'Final list of contesting candidates is published after withdrawal deadline',
    ],
    fact: 'If a candidate receives fewer than 1/6th of the valid votes in their constituency, their security deposit is forfeited to the government.',
  },
  {
    id: 4,
    title: 'Election Campaign',
    subtitle: 'Rallies, Ads & Outreach',
    icon: '🗣️',
    color: '#F7B731',
    description:
      'Candidates and parties campaign to win public support. Campaigning must stop 48 hours before polling begins — this is called the "Silent Period".',
    details: [
      'Parties hold rallies, door-to-door drives, and media advertisements',
      'Campaign expenditure limits: ₹95 lakh per candidate for Lok Sabha',
      'Offering cash, gifts or liquor to voters is a criminal offence',
      'All election-related expenses must be recorded in an account',
      'Campaigning stops 48 hours before polling (the "Silent Period")',
      'Exit poll results cannot be published while voting is ongoing',
    ],
    fact: 'ECI appoints Income Tax officials as Expenditure Observers to monitor every candidate\'s campaign spending in real time.',
  },
  {
    id: 5,
    title: 'Polling Day — Voting',
    subtitle: 'Cast Your Vote at the Booth',
    icon: '🗳️',
    color: '#20BF55',
    description:
      'Voters go to their assigned polling booth and cast their vote using an Electronic Voting Machine (EVM). The whole process is designed to be simple, secret, and secure.',
    details: [
      'Bring Voter ID or any of 12 approved photo ID documents',
      'Find your polling booth via voter slip or the Voter Helpline App',
      'Presiding Officer verifies your identity from the electoral roll',
      'Press the button next to your chosen candidate on the EVM',
      'VVPAT slip appears for 7 seconds showing your vote — verify it',
      'Indelible (permanent) ink is applied to your left index finger',
    ],
    fact: 'EVMs are standalone, tamper-proof devices manufactured by Bharat Electronics Ltd (BEL) and ECIL. They are never connected to the internet.',
  },
  {
    id: 6,
    title: 'Vote Counting & Results',
    subtitle: 'First-Past-The-Post System',
    icon: '🔢',
    color: '#E84393',
    description:
      'Votes are counted at designated Counting Centres on a date announced by ECI. The candidate with the highest vote count wins — this is the First-Past-The-Post (FPTP) system.',
    details: [
      'EVMs are transported to counting centres under tight security',
      'Authorised agents of all candidates are present throughout counting',
      'Results are updated on the ECI website round by round in real time',
      'Candidate with the most votes in a constituency wins (FPTP)',
      'Winning candidate receives a Certificate of Election from the RO',
      'Defeated candidates may file an Election Petition in High Court',
    ],
    fact: 'FPTP means a candidate can win with far less than 50% of votes if the opposition votes are split between many candidates. This is also called a "simple majority" system.',
  },
  {
    id: 7,
    title: 'Government Formation',
    subtitle: 'Majority → Oath → Governance',
    icon: '🏛️',
    color: '#5C4B92',
    description:
      'The party or coalition with a majority of seats forms the government. The leader is invited by the President or Governor to take oath as Prime Minister or Chief Minister.',
    details: [
      'For Lok Sabha, 272 out of 543 seats are needed for a simple majority',
      'President invites the leader of the majority party/coalition',
      'Prime Minister is sworn in by the President of India',
      'Cabinet Ministers are appointed by the PM and sworn in',
      'If no party gets majority, a coalition government is formed',
      'New government presents its first Union Budget and begins governance',
    ],
    fact: 'A situation where no single party wins a majority is called a "Hung Parliament." Coalition governments are then formed through negotiation between multiple parties.',
  },
];

// ── Election Types ────────────────────────────────────────────────────────────
export const ELECTION_TYPES = [
  {
    id: 'lok-sabha',
    name: 'Lok Sabha',
    subtitle: 'Lower House of Parliament — General Elections',
    icon: '🏛️',
    color: '#FF6200',
    seats: 543,
    term: '5 years',
    voterAge: '18+ years, Indian citizen',
    contestAge: '25+ years',
    description:
      'The Lok Sabha is the lower house of India\'s Parliament. Citizens directly elect 543 Members of Parliament (MPs). The party or coalition with 272+ seats forms the Central Government and its leader becomes Prime Minister.',
    keyFacts: [
      '543 constituencies — one MP elected per constituency',
      'Last general election held in 7 phases (April–June 2024)',
      '272+ seats needed for an outright majority',
      'Lok Sabha can be dissolved by the President on PM\'s advice',
      'MPs represent constituencies across all states and UTs',
    ],
  },
  {
    id: 'rajya-sabha',
    name: 'Rajya Sabha',
    subtitle: 'Upper House of Parliament — Indirect Elections',
    icon: '⚖️',
    color: '#2E86AB',
    seats: 245,
    term: '6 years (1/3 retire every 2 years)',
    voterAge: '18+ years (as an MLA)',
    contestAge: '30+ years',
    description:
      'The Rajya Sabha is the upper house, representing India\'s states and Union Territories. Members are not elected directly by citizens — they are elected by the elected members of each State Legislative Assembly (MLAs).',
    keyFacts: [
      '245 total seats: 233 elected + 12 nominated by President',
      'Elected by State Legislative Assembly members (MLAs)',
      '1/3 of members retire every two years',
      'Cannot be dissolved — it is a permanent house',
      'Rajya Sabha member must be 30 years or older',
    ],
  },
  {
    id: 'vidhan-sabha',
    name: 'Vidhan Sabha',
    subtitle: 'State Legislative Assembly — State Elections',
    icon: '🏢',
    color: '#20BF55',
    seats: 'Varies by state',
    term: '5 years',
    voterAge: '18+ years, Indian citizen',
    contestAge: '25+ years',
    description:
      'Each state has its own Vidhan Sabha (Legislative Assembly). Citizens directly elect Members of the Legislative Assembly (MLAs). The party or coalition with majority seats forms the State Government and its leader becomes Chief Minister.',
    keyFacts: [
      'Uttar Pradesh has the most seats (403); Sikkim has the fewest (32)',
      'State government controls law & order, health, education within the state',
      'Chief Minister is the head of the state executive',
      'Governor is the constitutional head of the state (appointed by President)',
      'Some states also have a Vidhan Parishad (upper house)',
    ],
  },
];

// ── FAQ Data ──────────────────────────────────────────────────────────────────
export const FAQS = [
  {
    q: 'How do I register as a voter?',
    a: 'Visit voters.eci.gov.in or download the Voter Helpline App. You must be 18 or older and an Indian citizen. Fill Form 6 online and upload your age proof, address proof, and a passport-size photo. After verification, your name is added to the Electoral Roll and your Voter ID card (EPIC) is sent to your address.',
  },
  {
    q: 'What documents can I use to vote if I don\'t have my Voter ID?',
    a: 'ECI accepts 12 alternative photo ID documents: Aadhaar Card, Passport, Driving Licence, PAN Card, MNREGA Job Card, Bank/Post Office Passbook with photo, Smart Card issued by RGI, Pension document with photo, NPR Smart Card, Disability Certificate with photo, and service identity cards issued by Central/State Government.',
  },
  {
    q: 'What is an EVM and is it safe?',
    a: 'An EVM (Electronic Voting Machine) is a tamper-proof standalone device used for casting votes. It is manufactured only by BEL and ECIL under strict government oversight. EVMs are never connected to any network or the internet. A VVPAT (Voter Verified Paper Audit Trail) machine is attached to every EVM so voters can verify their vote on a paper slip for 7 seconds after pressing the button.',
  },
  {
    q: 'What is the Model Code of Conduct (MCC)?',
    a: 'The MCC is a set of guidelines issued by ECI that all political parties and candidates must follow from the moment the election schedule is announced until results are declared. It prevents the ruling party from misusing government resources for campaigning, bans announcements of new government schemes, and ensures equal opportunities for all candidates. MCC violations can be reported to ECI at 1950.',
  },
  {
    q: 'What is NOTA and how does it work?',
    a: 'NOTA stands for "None of the Above." It is an option on every EVM that lets you reject all candidates without abstaining from voting entirely. NOTA was introduced in 2013 following a Supreme Court order. NOTA votes are counted and displayed in results, but even if NOTA gets the most votes, the candidate with the next highest votes still wins.',
  },
  {
    q: 'How are election results decided? What is FPTP?',
    a: 'India uses the First-Past-The-Post (FPTP) system. The candidate who receives the highest number of votes in a constituency wins — even if they don\'t have more than 50% of total votes. It is also called the "simple majority" system. Results are counted by the Returning Officer and announced publicly.',
  },
  {
    q: 'Who is eligible to contest in elections?',
    a: 'To contest in a Lok Sabha or Vidhan Sabha election, you must be: an Indian citizen, at least 25 years old, and registered as a voter somewhere in India. For Rajya Sabha, you must be 30 years old. Certain conditions disqualify a person — such as holding a government office of profit, being declared insolvent, or having a criminal conviction with a sentence of 2+ years.',
  },
  {
    q: 'How many phases does a Lok Sabha election have?',
    a: 'The number of phases varies each election. The 2024 Lok Sabha election was held in 7 phases spread over April and June 2024. Multi-phase elections allow ECI to deploy security forces systematically across a country as large as India.',
  },
];

// ── ECI State Offices ─────────────────────────────────────────────────────────
export const ECI_OFFICES = [
  { state: 'Andhra Pradesh',       ceo: 'CEO, Andhra Pradesh',        city: 'Amaravati',  phone: '0863-2340000', lat: 16.5062, lng: 80.6480,  address: 'Election Department, AP Secretariat, Velagapudi, Amaravati' },
  { state: 'Arunachal Pradesh',    ceo: 'CEO, Arunachal Pradesh',     city: 'Itanagar',   phone: '0360-2214512', lat: 27.0844, lng: 93.6053,  address: 'Chief Electoral Officer, Civil Secretariat, Itanagar - 791111' },
  { state: 'Assam',                ceo: 'CEO, Assam',                 city: 'Guwahati',   phone: '0361-2237199', lat: 26.1445, lng: 91.7362,  address: 'Chief Electoral Officer, Janata Bhawan, Dispur, Guwahati - 781006' },
  { state: 'Bihar',                ceo: 'CEO, Bihar',                 city: 'Patna',      phone: '0612-2215045', lat: 25.6139, lng: 85.1376,  address: 'Chief Electoral Officer, Vikas Bhawan, Bailey Road, Patna - 800015' },
  { state: 'Chhattisgarh',        ceo: 'CEO, Chhattisgarh',          city: 'Raipur',     phone: '0771-2234390', lat: 21.2514, lng: 81.6296,  address: 'Chief Electoral Officer, D.K.S. Bhawan, Mantralaya, Raipur - 492001' },
  { state: 'Goa',                  ceo: 'CEO, Goa',                   city: 'Panaji',     phone: '0832-2224836', lat: 15.4909, lng: 73.8278,  address: 'Chief Electoral Officer, EDC House, Panaji, Goa - 403001' },
  { state: 'Gujarat',              ceo: 'CEO, Gujarat',               city: 'Gandhinagar',phone: '079-23254070', lat: 23.2156, lng: 72.6369,  address: 'Chief Electoral Officer, Block No.5, Sachivalaya, Gandhinagar - 382010' },
  { state: 'Haryana',             ceo: 'CEO, Haryana',               city: 'Chandigarh', phone: '0172-2701376', lat: 30.7333, lng: 76.7794,  address: 'Chief Electoral Officer, 30 Bays Building, Sector 17, Chandigarh' },
  { state: 'Himachal Pradesh',    ceo: 'CEO, Himachal Pradesh',      city: 'Shimla',     phone: '0177-2620740', lat: 31.1048, lng: 77.1734,  address: 'Chief Electoral Officer, Block No.38, SDA Complex, Kasumpti, Shimla' },
  { state: 'Jharkhand',           ceo: 'CEO, Jharkhand',             city: 'Ranchi',     phone: '0651-2400757', lat: 23.3441, lng: 85.3096,  address: 'Chief Electoral Officer, Nepal House, Doranda, Ranchi - 834002' },
  { state: 'Karnataka',           ceo: 'CEO, Karnataka',             city: 'Bengaluru',  phone: '080-22353353', lat: 12.9716, lng: 77.5946,  address: 'Chief Electoral Officer, M.S. Building, Dr. Ambedkar Veedhi, Bengaluru - 560001' },
  { state: 'Kerala',              ceo: 'CEO, Kerala',                city: 'Thiruvananthapuram', phone: '0471-2518071', lat: 8.5241, lng: 76.9366, address: 'Chief Electoral Officer, Election Bhawan, Vikas Bhawan PO, Thiruvananthapuram - 695033' },
  { state: 'Madhya Pradesh',      ceo: 'CEO, Madhya Pradesh',        city: 'Bhopal',     phone: '0755-2441803', lat: 23.2599, lng: 77.4126,  address: 'Chief Electoral Officer, Vindhyachal Bhawan, Bhopal - 462004' },
  { state: 'Maharashtra',        ceo: 'CEO, Maharashtra',           city: 'Mumbai',     phone: '022-22025251', lat: 18.9388, lng: 72.8354,  address: 'Chief Electoral Officer, Old Mantralaya Building, Mumbai - 400032' },
  { state: 'Manipur',             ceo: 'CEO, Manipur',               city: 'Imphal',     phone: '0385-2450137', lat: 24.8170, lng: 93.9368,  address: 'Chief Electoral Officer, North AOC, Imphal - 795001' },
  { state: 'Meghalaya',           ceo: 'CEO, Meghalaya',             city: 'Shillong',   phone: '0364-2224234', lat: 25.5788, lng: 91.8933,  address: 'Chief Electoral Officer, Meghalaya Secretariat, Shillong - 793001' },
  { state: 'Mizoram',             ceo: 'CEO, Mizoram',               city: 'Aizawl',     phone: '0389-2322509', lat: 23.7271, lng: 92.7176,  address: 'Chief Electoral Officer, New Secretariat Complex, Aizawl - 796001' },
  { state: 'Nagaland',            ceo: 'CEO, Nagaland',              city: 'Kohima',     phone: '0370-2290025', lat: 25.6747, lng: 94.1086,  address: 'Chief Electoral Officer, Nagaland Secretariat, Kohima - 797004' },
  { state: 'Odisha',              ceo: 'CEO, Odisha',                city: 'Bhubaneswar',phone: '0674-2536336', lat: 20.2961, lng: 85.8245,  address: 'Chief Electoral Officer, Rajiv Bhawan, Bhubaneswar - 751001' },
  { state: 'Punjab',              ceo: 'CEO, Punjab',                city: 'Chandigarh', phone: '0172-2749055', lat: 30.7333, lng: 76.7794,  address: 'Chief Electoral Officer, Punjab Civil Secretariat, Chandigarh' },
  { state: 'Rajasthan',          ceo: 'CEO, Rajasthan',             city: 'Jaipur',     phone: '0141-2227811', lat: 26.9124, lng: 75.7873,  address: 'Chief Electoral Officer, Rajasthan Secretariat, Jaipur - 302005' },
  { state: 'Sikkim',              ceo: 'CEO, Sikkim',                city: 'Gangtok',    phone: '03592-202509', lat: 27.3389, lng: 88.6065,  address: 'Chief Electoral Officer, Tashiling Secretariat, Gangtok - 737103' },
  { state: 'Tamil Nadu',          ceo: 'CEO, Tamil Nadu',            city: 'Chennai',    phone: '044-28521616', lat: 13.0827, lng: 80.2707,  address: 'Chief Electoral Officer, Fort St. George, Chennai - 600009' },
  { state: 'Telangana',           ceo: 'CEO, Telangana',             city: 'Hyderabad',  phone: '040-23454088', lat: 17.3850, lng: 78.4867,  address: 'Chief Electoral Officer, BRKR Bhavan, Hyderabad - 500063' },
  { state: 'Tripura',             ceo: 'CEO, Tripura',               city: 'Agartala',   phone: '0381-2327577', lat: 23.8315, lng: 91.2868,  address: 'Chief Electoral Officer, Old Secretariat, Agartala - 799001' },
  { state: 'Uttar Pradesh',      ceo: 'CEO, Uttar Pradesh',         city: 'Lucknow',    phone: '0522-2239374', lat: 26.8467, lng: 80.9462,  address: 'Chief Electoral Officer, UP Secretariat, Lucknow - 226001' },
  { state: 'Uttarakhand',        ceo: 'CEO, Uttarakhand',           city: 'Dehradun',   phone: '0135-2712775', lat: 30.3165, lng: 78.0322,  address: 'Chief Electoral Officer, 4, Subhash Road, Dehradun - 248001' },
  { state: 'West Bengal',        ceo: 'CEO, West Bengal',           city: 'Kolkata',    phone: '033-22625976', lat: 22.5726, lng: 88.3639,  address: 'Chief Electoral Officer, Nirvachan Sadan, 18 Esplanade Row(E), Kolkata - 700073' },
  { state: 'Delhi (NCT)',        ceo: 'CEO, Delhi',                 city: 'New Delhi',  phone: '011-23379005', lat: 28.6139, lng: 77.2090,  address: 'Chief Electoral Officer, Old Secretariat, Delhi - 110054' },
  { state: 'Jammu & Kashmir',    ceo: 'CEO, Jammu & Kashmir',       city: 'Srinagar',   phone: '0194-2506336', lat: 34.0837, lng: 74.7973,  address: 'Chief Electoral Officer, Civil Secretariat, Srinagar' },
  { state: 'Ladakh',             ceo: 'CEO, Ladakh',                city: 'Leh',        phone: '01982-252088', lat: 34.1526, lng: 77.5771,  address: 'Chief Electoral Officer, Leh, Ladakh UT' },
  { state: 'Puducherry',         ceo: 'CEO, Puducherry',            city: 'Puducherry', phone: '0413-2334477', lat: 11.9416, lng: 79.8083,  address: 'Chief Electoral Officer, Anna Nagar, Puducherry - 605013' },
];

// ── Quick chat topics ─────────────────────────────────────────────────────────
export const QUICK_TOPICS = [
  { label: 'How to register as a voter?',         icon: '📋' },
  { label: 'What happens on voting day?',          icon: '🗳️' },
  { label: 'How does an EVM work?',                icon: '⚡' },
  { label: 'What is the Model Code of Conduct?',  icon: '📜' },
  { label: 'How are results counted?',             icon: '🔢' },
  { label: 'Difference between Lok Sabha and Rajya Sabha?', icon: '🏛️' },
  { label: 'Who can contest in elections?',        icon: '👤' },
  { label: 'What is NOTA?',                        icon: '✋' },
];
