// Amplop — seeded demo data for the fictional Alvarez household.
// All figures are invented demo data, consistent across Sep–Nov 2026 (USD).
// Seed data is the single source of truth: every view sums the same
// transactions, so dashboard, envelopes and reports can never disagree.
// Envelope "spent" is always the sum of that month's transactions.
const HOUSEHOLD = {
  householdName: 'The Alvarez Household',
  months: ['2026-09', '2026-10', '2026-11'],
  currentMonth: '2026-11',
  currency: 'USD',
  income: {
    '2026-09': [
      { source: 'Ana — salary (teacher)', amount: 3300 },
      { source: 'Marco — salary (mechanic)', amount: 2050 },
      { source: 'Marco — weekend repairs', amount: 300 }
    ],
    '2026-10': [
      { source: 'Ana — salary (teacher)', amount: 3350 },
      { source: 'Marco — salary (mechanic)', amount: 2100 },
      { source: 'Marco — weekend repairs', amount: 300 }
    ],
    '2026-11': [
      { source: 'Ana — salary (teacher)', amount: 3400 },
      { source: 'Marco — salary (mechanic)', amount: 2150 },
      { source: 'Marco — weekend repairs', amount: 300 }
    ]
  },
  envelopes: [
    { id: 'rent', name: 'Rent & Utilities', color: '#b4552d', budget: { '2026-09': 1850, '2026-10': 1850, '2026-11': 1850 }, note: 'Rent is fixed; utilities roll over if under.' },
    { id: 'groceries', name: 'Groceries', color: '#5f7a54', budget: { '2026-09': 680, '2026-10': 700, '2026-11': 720 }, note: 'Weekly shop on Saturdays, market on Sundays.' },
    { id: 'transport', name: 'Transport', color: '#3d6b8e', budget: { '2026-09': 290, '2026-10': 300, '2026-11': 310 }, note: 'Fuel, metro passes and parking.' },
    { id: 'dining', name: 'Dining Out', color: '#c98a2e', budget: { '2026-09': 220, '2026-10': 230, '2026-11': 240 }, note: 'One family dinner out a week, at most.' },
    { id: 'kids', name: 'Kids', color: '#7a5c9e', budget: { '2026-09': 350, '2026-10': 360, '2026-11': 380 }, note: 'Leo (9) and Sofia (7): school, sport, books.' },
    { id: 'fun', name: 'Fun', color: '#c25e7a', budget: { '2026-09': 160, '2026-10': 170, '2026-11': 180 }, note: 'Movies, games and small treats — guilt-free.' },
    { id: 'health', name: 'Health', color: '#4a8a7a', budget: { '2026-09': 200, '2026-10': 210, '2026-11': 220 }, note: 'Pharmacy, dentist and check-ups.' },
    { id: 'household', name: 'Household', color: '#8a6d4b', budget: { '2026-09': 240, '2026-10': 250, '2026-11': 260 }, note: 'Cleaning, repairs and things for the flat.' }
  ],
  goals: [
    { id: 'emergency', name: 'Emergency fund', target: 6000, saved: 4350, note: 'Six months of rent, for the unexpected.' },
    { id: 'trip', name: 'Summer trip', target: 2400, saved: 950, note: 'A week by the sea next July.' },
    { id: 'fridge', name: 'New fridge', target: 900, saved: 620, note: 'The old one hums too loud since spring.' },
    { id: 'school', name: 'Kids\u2019 school fund', target: 1500, saved: 410, note: 'Next year\u2019s books, uniforms and trips.' }
  ],
  members: ['Ana', 'Marco', 'Leo', 'Sofia'],
  splitPresets: [
    { name: 'Electricity bill', amount: 148 },
    { name: 'Internet — fibre 100 Mbps', amount: 85 },
    { name: 'Weekly grocery run', amount: 142 }
  ],
  transactions: [
    // --- November 2026: income ---
    { id: 1, date: '2026-11-01', desc: 'Ana — salary (teacher)', env: null, amount: 3400, type: 'income' },
    { id: 2, date: '2026-11-01', desc: 'Marco — salary (mechanic)', env: null, amount: 2150, type: 'income' },
    { id: 3, date: '2026-11-14', desc: 'Marco — weekend repairs', env: null, amount: 300, type: 'income' },
    // --- November 2026: Rent & Utilities (budget 1850, spent 1850) ---
    { id: 4, date: '2026-11-01', desc: 'Rent — Maple Court Apt 4B', env: 'rent', amount: 1500, type: 'expense' },
    { id: 5, date: '2026-11-05', desc: 'Electric — City Power', env: 'rent', amount: 148, type: 'expense' },
    { id: 6, date: '2026-11-08', desc: 'Water — City Water', env: 'rent', amount: 62, type: 'expense' },
    { id: 7, date: '2026-11-03', desc: 'Internet — fibre 100 Mbps', env: 'rent', amount: 85, type: 'expense' },
    { id: 8, date: '2026-11-12', desc: 'Gas — City Gas', env: 'rent', amount: 55, type: 'expense' },
    // --- November 2026: Groceries (budget 720, spent 668) ---
    { id: 9, date: '2026-11-02', desc: 'Weekly shop — GreenMart', env: 'groceries', amount: 142, type: 'expense' },
    { id: 10, date: '2026-11-07', desc: 'Weekly shop — GreenMart', env: 'groceries', amount: 96, type: 'expense' },
    { id: 11, date: '2026-11-11', desc: 'Farmers market', env: 'groceries', amount: 118, type: 'expense' },
    { id: 12, date: '2026-11-15', desc: 'Weekly shop — GreenMart', env: 'groceries', amount: 87, type: 'expense' },
    { id: 13, date: '2026-11-21', desc: 'Weekly shop — GreenMart', env: 'groceries', amount: 154, type: 'expense' },
    { id: 14, date: '2026-11-26', desc: 'Thanksgiving shop — GreenMart', env: 'groceries', amount: 71, type: 'expense' },
    // --- November 2026: Transport (budget 310, spent 284) ---
    { id: 15, date: '2026-11-04', desc: 'Fuel — Shell', env: 'transport', amount: 48, type: 'expense' },
    { id: 16, date: '2026-11-10', desc: 'Fuel — Shell', env: 'transport', amount: 52, type: 'expense' },
    { id: 17, date: '2026-11-17', desc: 'Fuel — Shell', env: 'transport', amount: 44, type: 'expense' },
    { id: 18, date: '2026-11-01', desc: 'Metro passes (2)', env: 'transport', amount: 96, type: 'expense' },
    { id: 19, date: '2026-11-19', desc: 'Parking — downtown', env: 'transport', amount: 44, type: 'expense' },
    // --- November 2026: Dining Out (budget 240, spent 283 — over) ---
    { id: 20, date: '2026-11-06', desc: 'Pizza night — Tony\u2019s', env: 'dining', amount: 34, type: 'expense' },
    { id: 21, date: '2026-11-09', desc: 'Lunch — Noodle House', env: 'dining', amount: 42, type: 'expense' },
    { id: 22, date: '2026-11-13', desc: 'Tacos — El Camino', env: 'dining', amount: 28, type: 'expense' },
    { id: 23, date: '2026-11-16', desc: 'Dinner — Olive Garden', env: 'dining', amount: 56, type: 'expense' },
    { id: 24, date: '2026-11-20', desc: 'Sushi — Sakura', env: 'dining', amount: 47, type: 'expense' },
    { id: 25, date: '2026-11-23', desc: 'Burgers — Five Guys', env: 'dining', amount: 38, type: 'expense' },
    { id: 26, date: '2026-11-27', desc: 'Coffee + pastries — Blue Bottle', env: 'dining', amount: 38, type: 'expense' },
    // --- November 2026: Kids (budget 380, spent 352) ---
    { id: 27, date: '2026-11-03', desc: 'School lunch top-up', env: 'kids', amount: 64, type: 'expense' },
    { id: 28, date: '2026-11-07', desc: 'Soccer fees — Leo', env: 'kids', amount: 120, type: 'expense' },
    { id: 29, date: '2026-11-14', desc: 'Books — Sofia', env: 'kids', amount: 92, type: 'expense' },
    { id: 30, date: '2026-11-22', desc: 'Haircuts — Leo & Sofia', env: 'kids', amount: 76, type: 'expense' },
    // --- November 2026: Fun (budget 180, spent 141) ---
    { id: 31, date: '2026-11-08', desc: 'Movie tickets — family', env: 'fun', amount: 36, type: 'expense' },
    { id: 32, date: '2026-11-12', desc: 'Board game — Catan', env: 'fun', amount: 45, type: 'expense' },
    { id: 33, date: '2026-11-15', desc: 'Streaming — Netflix', env: 'fun', amount: 15, type: 'expense' },
    { id: 34, date: '2026-11-21', desc: 'Ice cream — Gelato Roma', env: 'fun', amount: 22, type: 'expense' },
    { id: 35, date: '2026-11-25', desc: 'Arcade — Leo\u2019s birthday', env: 'fun', amount: 23, type: 'expense' },
    // --- November 2026: Health (budget 220, spent 196) ---
    { id: 36, date: '2026-11-10', desc: 'Pharmacy — vitamins', env: 'health', amount: 48, type: 'expense' },
    { id: 37, date: '2026-11-18', desc: 'Dentist — Sofia check-up', env: 'health', amount: 120, type: 'expense' },
    { id: 38, date: '2026-11-24', desc: 'Pharmacy — allergy meds', env: 'health', amount: 28, type: 'expense' },
    // --- November 2026: Household (budget 260, spent 229) ---
    { id: 39, date: '2026-11-05', desc: 'Cleaning supplies', env: 'household', amount: 54, type: 'expense' },
    { id: 40, date: '2026-11-11', desc: 'Light bulbs + batteries', env: 'household', amount: 31, type: 'expense' },
    { id: 41, date: '2026-11-17', desc: 'Bath towels', env: 'household', amount: 68, type: 'expense' },
    { id: 42, date: '2026-11-24', desc: 'Toolbox set', env: 'household', amount: 76, type: 'expense' },
    // --- October 2026: income ---
    { id: 43, date: '2026-10-01', desc: 'Ana — salary (teacher)', env: null, amount: 3350, type: 'income' },
    { id: 44, date: '2026-10-01', desc: 'Marco — salary (mechanic)', env: null, amount: 2100, type: 'income' },
    { id: 45, date: '2026-10-14', desc: 'Marco — weekend repairs', env: null, amount: 300, type: 'income' },
    // --- October 2026: Rent & Utilities (budget 1850, spent 1850) ---
    { id: 46, date: '2026-10-01', desc: 'Rent — Maple Court Apt 4B', env: 'rent', amount: 1500, type: 'expense' },
    { id: 47, date: '2026-10-05', desc: 'Electric — City Power', env: 'rent', amount: 140, type: 'expense' },
    { id: 48, date: '2026-10-08', desc: 'Water — City Water', env: 'rent', amount: 58, type: 'expense' },
    { id: 49, date: '2026-10-03', desc: 'Internet — fibre 100 Mbps', env: 'rent', amount: 82, type: 'expense' },
    { id: 50, date: '2026-10-12', desc: 'Gas — City Gas', env: 'rent', amount: 70, type: 'expense' },
    // --- October 2026: Groceries (budget 700, spent 641) ---
    { id: 51, date: '2026-10-03', desc: 'Weekly shop — GreenMart', env: 'groceries', amount: 128, type: 'expense' },
    { id: 52, date: '2026-10-08', desc: 'Weekly shop — GreenMart', env: 'groceries', amount: 104, type: 'expense' },
    { id: 53, date: '2026-10-12', desc: 'Farmers market', env: 'groceries', amount: 96, type: 'expense' },
    { id: 54, date: '2026-10-17', desc: 'Weekly shop — GreenMart', env: 'groceries', amount: 141, type: 'expense' },
    { id: 55, date: '2026-10-22', desc: 'Weekly shop — GreenMart', env: 'groceries', amount: 88, type: 'expense' },
    { id: 56, date: '2026-10-29', desc: 'Weekly shop — GreenMart', env: 'groceries', amount: 84, type: 'expense' },
    // --- October 2026: Transport (budget 300, spent 272) ---
    { id: 57, date: '2026-10-04', desc: 'Fuel — Shell', env: 'transport', amount: 46, type: 'expense' },
    { id: 58, date: '2026-10-11', desc: 'Fuel — Shell', env: 'transport', amount: 51, type: 'expense' },
    { id: 59, date: '2026-10-18', desc: 'Fuel — Shell', env: 'transport', amount: 39, type: 'expense' },
    { id: 60, date: '2026-10-01', desc: 'Metro passes (2)', env: 'transport', amount: 92, type: 'expense' },
    { id: 61, date: '2026-10-20', desc: 'Parking — downtown', env: 'transport', amount: 44, type: 'expense' },
    // --- October 2026: Dining Out (budget 230, spent 218) ---
    { id: 62, date: '2026-10-05', desc: 'Pizza night — Tony\u2019s', env: 'dining', amount: 31, type: 'expense' },
    { id: 63, date: '2026-10-10', desc: 'Lunch — Noodle House', env: 'dining', amount: 44, type: 'expense' },
    { id: 64, date: '2026-10-14', desc: 'Tacos — El Camino', env: 'dining', amount: 26, type: 'expense' },
    { id: 65, date: '2026-10-17', desc: 'Dinner — Olive Garden', env: 'dining', amount: 52, type: 'expense' },
    { id: 66, date: '2026-10-24', desc: 'Sushi — Sakura', env: 'dining', amount: 38, type: 'expense' },
    { id: 67, date: '2026-10-28', desc: 'Coffee + pastries — Blue Bottle', env: 'dining', amount: 27, type: 'expense' },
    // --- October 2026: Kids (budget 360, spent 334) ---
    { id: 68, date: '2026-10-06', desc: 'School supplies', env: 'kids', amount: 110, type: 'expense' },
    { id: 69, date: '2026-10-10', desc: 'School lunch top-up', env: 'kids', amount: 74, type: 'expense' },
    { id: 70, date: '2026-10-15', desc: 'Piano books — Sofia', env: 'kids', amount: 96, type: 'expense' },
    { id: 71, date: '2026-10-26', desc: 'Haircuts — Leo & Sofia', env: 'kids', amount: 54, type: 'expense' },
    // --- October 2026: Fun (budget 170, spent 158) ---
    { id: 72, date: '2026-10-09', desc: 'Movie night — family', env: 'fun', amount: 42, type: 'expense' },
    { id: 73, date: '2026-10-13', desc: 'Board game night snacks', env: 'fun', amount: 28, type: 'expense' },
    { id: 74, date: '2026-10-15', desc: 'Streaming — Netflix', env: 'fun', amount: 15, type: 'expense' },
    { id: 75, date: '2026-10-21', desc: 'Mini golf — family', env: 'fun', amount: 48, type: 'expense' },
    { id: 76, date: '2026-10-27', desc: 'Ice cream — Gelato Roma', env: 'fun', amount: 25, type: 'expense' },
    // --- October 2026: Health (budget 210, spent 187) ---
    { id: 77, date: '2026-10-07', desc: 'Dentist — Leo check-up', env: 'health', amount: 96, type: 'expense' },
    { id: 78, date: '2026-10-16', desc: 'Pharmacy — cold medicine', env: 'health', amount: 63, type: 'expense' },
    { id: 79, date: '2026-10-23', desc: 'Pharmacy — vitamins', env: 'health', amount: 28, type: 'expense' },
    // --- October 2026: Household (budget 250, spent 214) ---
    { id: 80, date: '2026-10-06', desc: 'Laundry detergent + soap', env: 'household', amount: 58, type: 'expense' },
    { id: 81, date: '2026-10-14', desc: 'Storage bins', env: 'household', amount: 72, type: 'expense' },
    { id: 82, date: '2026-10-25', desc: 'Curtains — living room', env: 'household', amount: 84, type: 'expense' },
    // --- September 2026: income ---
    { id: 83, date: '2026-09-01', desc: 'Ana — salary (teacher)', env: null, amount: 3300, type: 'income' },
    { id: 84, date: '2026-09-01', desc: 'Marco — salary (mechanic)', env: null, amount: 2050, type: 'income' },
    { id: 85, date: '2026-09-14', desc: 'Marco — weekend repairs', env: null, amount: 300, type: 'income' },
    // --- September 2026: Rent & Utilities (budget 1850, spent 1850) ---
    { id: 86, date: '2026-09-01', desc: 'Rent — Maple Court Apt 4B', env: 'rent', amount: 1500, type: 'expense' },
    { id: 87, date: '2026-09-05', desc: 'Electric — City Power', env: 'rent', amount: 132, type: 'expense' },
    { id: 88, date: '2026-09-08', desc: 'Water — City Water', env: 'rent', amount: 61, type: 'expense' },
    { id: 89, date: '2026-09-03', desc: 'Internet — fibre 100 Mbps', env: 'rent', amount: 84, type: 'expense' },
    { id: 90, date: '2026-09-12', desc: 'Gas — City Gas', env: 'rent', amount: 73, type: 'expense' },
    // --- September 2026: Groceries (budget 680, spent 602) ---
    { id: 91, date: '2026-09-03', desc: 'Weekly shop — GreenMart', env: 'groceries', amount: 118, type: 'expense' },
    { id: 92, date: '2026-09-08', desc: 'Weekly shop — GreenMart', env: 'groceries', amount: 92, type: 'expense' },
    { id: 93, date: '2026-09-12', desc: 'Farmers market', env: 'groceries', amount: 104, type: 'expense' },
    { id: 94, date: '2026-09-17', desc: 'Weekly shop — GreenMart', env: 'groceries', amount: 126, type: 'expense' },
    { id: 95, date: '2026-09-22', desc: 'Weekly shop — GreenMart', env: 'groceries', amount: 89, type: 'expense' },
    { id: 96, date: '2026-09-29', desc: 'Weekly shop — GreenMart', env: 'groceries', amount: 73, type: 'expense' },
    // --- September 2026: Transport (budget 290, spent 258) ---
    { id: 97, date: '2026-09-04', desc: 'Fuel — Shell', env: 'transport', amount: 44, type: 'expense' },
    { id: 98, date: '2026-09-11', desc: 'Fuel — Shell', env: 'transport', amount: 48, type: 'expense' },
    { id: 99, date: '2026-09-18', desc: 'Fuel — Shell', env: 'transport', amount: 36, type: 'expense' },
    { id: 100, date: '2026-09-01', desc: 'Metro passes (2)', env: 'transport', amount: 88, type: 'expense' },
    { id: 101, date: '2026-09-20', desc: 'Parking — downtown', env: 'transport', amount: 42, type: 'expense' },
    // --- September 2026: Dining Out (budget 220, spent 201) ---
    { id: 102, date: '2026-09-05', desc: 'Pizza night — Tony\u2019s', env: 'dining', amount: 29, type: 'expense' },
    { id: 103, date: '2026-09-10', desc: 'Lunch — Noodle House', env: 'dining', amount: 38, type: 'expense' },
    { id: 104, date: '2026-09-14', desc: 'Tacos — El Camino', env: 'dining', amount: 41, type: 'expense' },
    { id: 105, date: '2026-09-17', desc: 'Dinner — Olive Garden', env: 'dining', amount: 47, type: 'expense' },
    { id: 106, date: '2026-09-24', desc: 'Sushi — Sakura', env: 'dining', amount: 26, type: 'expense' },
    { id: 107, date: '2026-09-28', desc: 'Coffee + pastries — Blue Bottle', env: 'dining', amount: 20, type: 'expense' },
    // --- September 2026: Kids (budget 350, spent 318) ---
    { id: 108, date: '2026-09-06', desc: 'School supplies', env: 'kids', amount: 104, type: 'expense' },
    { id: 109, date: '2026-09-10', desc: 'School lunch top-up', env: 'kids', amount: 68, type: 'expense' },
    { id: 110, date: '2026-09-15', desc: 'Art supplies — Sofia', env: 'kids', amount: 88, type: 'expense' },
    { id: 111, date: '2026-09-26', desc: 'Haircuts — Leo & Sofia', env: 'kids', amount: 58, type: 'expense' },
    // --- September 2026: Fun (budget 160, spent 132) ---
    { id: 112, date: '2026-09-09', desc: 'Movie night — family', env: 'fun', amount: 34, type: 'expense' },
    { id: 113, date: '2026-09-13', desc: 'Board game — Ticket to Ride', env: 'fun', amount: 22, type: 'expense' },
    { id: 114, date: '2026-09-15', desc: 'Streaming — Netflix', env: 'fun', amount: 15, type: 'expense' },
    { id: 115, date: '2026-09-21', desc: 'Bowling — family', env: 'fun', amount: 41, type: 'expense' },
    { id: 116, date: '2026-09-27', desc: 'Ice cream — Gelato Roma', env: 'fun', amount: 20, type: 'expense' },
    // --- September 2026: Health (budget 200, spent 174) ---
    { id: 117, date: '2026-09-07', desc: 'Doctor visit — Ana', env: 'health', amount: 88, type: 'expense' },
    { id: 118, date: '2026-09-16', desc: 'Pharmacy — cold medicine', env: 'health', amount: 58, type: 'expense' },
    { id: 119, date: '2026-09-23', desc: 'Pharmacy — vitamins', env: 'health', amount: 28, type: 'expense' },
    // --- September 2026: Household (budget 240, spent 196) ---
    { id: 120, date: '2026-09-06', desc: 'Kitchen towels', env: 'household', amount: 52, type: 'expense' },
    { id: 121, date: '2026-09-14', desc: 'Plant pots — balcony', env: 'household', amount: 66, type: 'expense' },
    { id: 122, date: '2026-09-25', desc: 'Desk lamp — Sofia', env: 'household', amount: 78, type: 'expense' }
  ]
};
