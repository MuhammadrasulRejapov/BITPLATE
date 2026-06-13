# BitePlate — Frontend Texnik Topshirig'i (TZ)
## Frontend Developer uchun

---

## Loyiha haqida

**BitePlate** — restoran boshqaruv tizimi. Frontend qismi faqat UI (interfeys) bo'lib, hozircha backend yo'q. Barcha ma'lumotlar **mock data** (qo'lda yozilgan JSON) orqali ishlaydi. Backend tayyor bo'lgach, mock data o'rniga real API ulanadi.

| Maydon | Ma'lumot |
|---|---|
| Loyiha nomi | BitePlate SRMS |
| Frontend turi | Web ilova (React yoki Vue — developer tanlaydi) |
| Til | TypeScript yoki JavaScript |
| Stilizatsiya | Tailwind CSS yoki CSS Modules |
| Mock data | JSON fayllari yoki `useState` ichida |
| Backend | Hozircha yo'q — keyinroq ulanadi |
| Dizayn uslubi | Clean, professional, restoran POS tizimiga o'xshash |

---

## Foydalanuvchi rollari (kim tizimga kiradi)

Tizimda 4 ta rol bor. Har bir rol faqat o'z bo'limini ko'radi:

| Rol | Ko'rish huquqi |
|---|---|
| **Manager** | Hamma sahifalar + hisobotlar |
| **Waiter (Ofitsiant)** | Stollar, buyurtmalar, menyu |
| **Chef (Oshpaz)** | Faqat oshxona navbati |
| **Cashier (Kassir)** | Faqat billing/hisob sahifasi |

> Frontend uchun: Login sahifasida rol tanlansin (haqiqiy autentifikatsiya shart emas, faqat `localStorage`da rol saqlansin).

---

## Sahifalar ro'yxati

```
/login              → Rol tanlash sahifasi
/dashboard          → Umumiy ko'rinish (Manager uchun)
/tables             → Stollar xaritasi (Ofitsiant)
/tables/:id         → Bitta stol detail + buyurtma berish
/kitchen            → Oshxona navbati (Chef)
/menu               → Menyu (Ofitsiant + Manager)
/billing/:orderId   → Hisob sahifasi (Kassir)
/history            → Buyurtmalar tarixi (Manager)
/reservations       → Bron tizimi (Manager + Ofitsiant)
```

---

## Sahifalar — batafsil

---

### 1. `/login` — Kirish sahifasi

**Maqsad:** Foydalanuvchi rolini tanlaydi va tizimga kiradi.

**UI elementlar:**
- BitePlate logotipi + nomi
- 4 ta karta (Manager, Waiter, Chef, Cashier)
- Har bir kartada: ikon, rol nomi, qisqa tavsif
- "Kirish" tugmasi

**Xatti-harakat:**
- Rol tanlanadi → `localStorage`ga yoziladi → tegishli sahifaga yo'naltiriladi
  - Manager → `/dashboard`
  - Waiter → `/tables`
  - Chef → `/kitchen`
  - Cashier → `/billing` (birinchi ochiq hisob)

**Mock data:** Shart emas — faqat 4 ta tugma.

---

### 2. `/dashboard` — Bosh sahifa (Manager)

**Maqsad:** Rеstoran holatini bir qarashda ko'rish.

**UI elementlar:**

```
┌─────────────────────────────────────────────┐
│  Bugun: 2026-06-04   Faol smena: Kechki     │
├──────────┬──────────┬──────────┬────────────┤
│ 12       │ 8        │ 4        │ 2,450,000  │
│ Jami stol│ Band stol│ Bo'sh    │ Bugungi    │
│          │          │ stol     │ daromad    │
├──────────┴──────────┴──────────┴────────────┤
│ Faol buyurtmalar: 6                          │
│ Navbatdagi bronlar: 3                        │
│ Oshxona navbatida: 4 ta buyurtma             │
└─────────────────────────────────────────────┘
```

**Qo'shimcha bloklar:**
- So'nggi 5 ta buyurtma (jadval ko'rinishida)
- Eng ko'p buyurtma berilgan 3 ta taom (bugun)
- Tezkor havolalar: Stollar, Oshxona, Tarix

**Mock data:**
```json
{
  "stats": {
    "totalTables": 12,
    "occupiedTables": 8,
    "freeTables": 4,
    "todayRevenue": 2450000
  },
  "activeOrders": 6,
  "upcomingReservations": 3,
  "kitchenQueue": 4
}
```

---

### 3. `/tables` — Stollar xaritasi (Ofitsiant + Manager)

**Maqsad:** Barcha stollar holati ko'rinadi, stol tanlanib buyurtma beriladi.

**UI elementlar:**

Stollar grid ko'rinishida, har bir stol kartasi:
```
┌──────────┐
│  Stol 5  │
│          │
│  BAND    │
│          │
│ 4 kishi  │
│ 45 daqiqa│
└──────────┘
```

**Stol holatlari va ranglari:**

| Holat | Rang | Ma'no |
|---|---|---|
| `Free` | Yashil | Bo'sh, mijoz o'tira oladi |
| `Reserved` | Ko'k | Bron qilingan |
| `Occupied` | Sariq | Band, buyurtma berilgan |
| `Awaiting Bill` | To'q sariq | Hisob kutilmoqda |
| `Cleared` | Kulrang | Tozalanmoqda |

**Filtr tugmalari:** Barchasi | Bo'sh | Band | Bron

**Stol kartasiga bosish:**
- Bo'sh stol → Mijoz o'tqazish modali
- Band stol → `/tables/:id` ga o'tish

**Mock data:**
```json
[
  { "id": 1, "number": 1, "capacity": 2, "status": "Free", "currentGuests": 0 },
  { "id": 2, "number": 2, "capacity": 4, "status": "Occupied", "currentGuests": 3, "occupiedSince": "18:30", "waiterId": "w1" },
  { "id": 3, "number": 3, "capacity": 6, "status": "Reserved", "currentGuests": 0, "reservationTime": "20:00", "guestName": "Aliyev A." },
  { "id": 4, "number": 4, "capacity": 4, "status": "AwaitingBill", "currentGuests": 4 },
  { "id": 5, "number": 5, "capacity": 2, "status": "Cleared", "currentGuests": 0 },
  { "id": 6, "number": 6, "capacity": 8, "status": "Free", "currentGuests": 0 }
]
```

---

### 4. `/tables/:id` — Stol detail + Buyurtma berish

**Maqsad:** Bitta stol uchun buyurtma qabul qilish va boshqarish.

**Layout (2 ustun):**

```
┌─────────────────────┬──────────────────────┐
│   MENYU             │   BUYURTMA SAVATI    │
│                     │                      │
│ [Starter] [Main]    │  Stol 5 | 3 kishi   │
│ [Dessert] [Drinks]  │  ─────────────────   │
│                     │  1x Caesar Salad     │
│ ┌────────────────┐  │     28,000 so'm      │
│ │ Caesar Salat   │  │  2x Burger           │
│ │ 28,000 so'm   │  │     84,000 so'm      │
│ │    [+]  [-]   │  │  ─────────────────   │
│ └────────────────┘  │  Jami: 112,000 so'm  │
│ ┌────────────────┐  │                      │
│ │ Margherita Pzz │  │  [Buyurtma yuborish] │
│ │ 45,000 so'm   │  │  [Hisobni chiqarish] │
│ │    [+]  [-]   │  │                      │
│ └────────────────┘  │                      │
└─────────────────────┴──────────────────────┘
```

**Xususiyatlar:**
- Kategoriya bo'yicha menyu filtri
- Har bir taom uchun qo'shish/olib tashlash tugmalari
- Taomga **qo'shimcha** qo'shish (Decorator pattern):
  - Taom kartasiga bosish → modal ochiladi
  - Modal ichida: "Qo'shimchalar" checkbox ro'yxati
  - Masalan: "+ Pishloq (+5,000)", "Gluten yo'q", "O'tkir emas"
- Buyurtma yuborilgandan keyin → oshxona navbatiga ketadi
- "Hisobni chiqarish" → `/billing/:orderId` ga o'tadi

**Mock data — Menyu:**
```json
{
  "categories": ["Starter", "Main", "Dessert", "Beverage"],
  "items": [
    {
      "id": "m1",
      "name": "Caesar Salat",
      "category": "Starter",
      "price": 28000,
      "description": "Romaine, parmesan, crouton",
      "allergens": ["dairy", "gluten"],
      "addons": [
        { "id": "a1", "name": "Qo'shimcha pishloq", "price": 5000 },
        { "id": "a2", "name": "Tovuq qo'shish", "price": 12000 },
        { "id": "a3", "name": "Gluten yo'q", "price": 0 }
      ]
    },
    {
      "id": "m2",
      "name": "Smash Burger",
      "category": "Main",
      "price": 42000,
      "description": "Mol go'shtli burger",
      "allergens": ["gluten", "dairy"],
      "addons": [
        { "id": "a4", "name": "Qo'shimcha kotlet", "price": 18000 },
        { "id": "a5", "name": "Bekon", "price": 10000 },
        { "id": "a6", "name": "O'tkir sous", "price": 2000 }
      ]
    },
    {
      "id": "m3",
      "name": "Cheesecake",
      "category": "Dessert",
      "price": 22000,
      "description": "New York uslubidagi cheesecake",
      "allergens": ["dairy", "eggs"],
      "addons": [
        { "id": "a7", "name": "Meva sousi", "price": 5000 }
      ]
    },
    {
      "id": "m4",
      "name": "Limonad",
      "category": "Beverage",
      "price": 15000,
      "description": "Yangi siqilgan limon",
      "allergens": [],
      "addons": [
        { "id": "a8", "name": "Qand yo'q", "price": 0 },
        { "id": "a9", "name": "Muz ko'proq", "price": 0 }
      ]
    }
  ]
}
```

---

### 5. `/kitchen` — Oshxona navbati (Chef)

**Maqsad:** Chef buyurtmalarni ko'radi, holat o'zgartiradi, bekor qiladi.

**UI elementlar:**

```
┌──────────────────────────────────────────────┐
│  OSHXONA NAVBATI          Faol: 4 ta         │
├───────────────────────────────────────────────┤
│                                               │
│  ┌──────────────┐  ┌──────────────┐          │
│  │ #ORD-042     │  │ #ORD-043     │          │
│  │ Stol 3       │  │ Stol 7       │          │
│  │ 18:45        │  │ 18:52        │          │
│  │──────────────│  │──────────────│          │
│  │ • Caesar x1  │  │ • Burger x2  │          │
│  │ • Burger x2  │  │   - Bekon    │          │
│  │              │  │ • Limonad x1 │          │
│  │ [Tayyorlash] │  │ [Tayyorlash] │          │
│  │ [Bekor qilish│  │ [Bekor qilish│          │
│  └──────────────┘  └──────────────┘          │
│                                               │
│  [↩ Oxirgi amalni bekor qilish (Undo)]       │
└───────────────────────────────────────────────┘
```

**Holat o'zgarish oqimi:**
```
Kutilmoqda → Tayyorlanmoqda → Tayyor → Xizmat qilindi
```

**Xususiyatlar:**
- Har bir buyurtma karta shaklida
- Holat rangi: Kutilmoqda (sariq), Tayyorlanmoqda (ko'k), Tayyor (yashil)
- "Undo" tugmasi — oxirgi o'zgartirishni qaytaradi (Command pattern)
- Yangi buyurtma kelganda ovozli signal yoki vizual yangilanish

**Mock data:**
```json
[
  {
    "id": "ORD-042",
    "tableNumber": 3,
    "time": "18:45",
    "status": "Pending",
    "items": [
      { "name": "Caesar Salat", "qty": 1, "addons": [] },
      { "name": "Smash Burger", "qty": 2, "addons": ["Bekon", "O'tkir sous"] }
    ]
  },
  {
    "id": "ORD-043",
    "tableNumber": 7,
    "time": "18:52",
    "status": "Preparing",
    "items": [
      { "name": "Smash Burger", "qty": 2, "addons": ["Qo'shimcha kotlet"] },
      { "name": "Limonad", "qty": 1, "addons": ["Muz ko'proq"] }
    ]
  }
]
```

---

### 6. `/billing/:orderId` — Hisob sahifasi (Kassir)

**Maqsad:** Buyurtma uchun hisob chiqarish, chegirma qo'shish, to'lovni qabul qilish.

**UI elementlar:**

```
┌──────────────────────────────────────────┐
│  HISOB — Stol 3   #ORD-042              │
├──────────────────────────────────────────┤
│  Caesar Salat  x1         28,000         │
│  Smash Burger  x2         84,000         │
│    + Bekon                 10,000        │
│  ─────────────────────────────────       │
│  Oraliq jami:            122,000         │
│                                          │
│  Chegirma turi:                          │
│  ○ Chegirmasiz   ● Baxtli soat (20%)    │
│  ○ Sodiq mijoz (10%)                     │
│                                          │
│  Chegirma:               -24,400         │
│  Soliq (12%):             11,712         │
│  Tip:          [    ]                    │
│  ─────────────────────────────────       │
│  JAMI:                   109,312         │
│                                          │
│  To'lov usuli:                           │
│  [Naqd]  [Karta]  [Bo'lib to'lash]      │
│                                          │
│  [Hisobni yopish]                        │
└──────────────────────────────────────────┘
```

**Xususiyatlar:**
- Chegirma tanlanganda narx real vaqtda yangilanadi (Strategy pattern vizualizatsiyasi)
- "Bo'lib to'lash" → modal: necha kishiga bo'linsin? → har biri qancha to'laydi
- Tip qo'shish imkoniyati (summadan % yoki qo'lda)
- "Hisobni yopish" → stol holati `Cleared` ga o'tadi → tarix jurnalga yoziladi

**Mock data:**
```json
{
  "orderId": "ORD-042",
  "tableNumber": 3,
  "waiter": "Sardor",
  "items": [
    { "name": "Caesar Salat", "qty": 1, "unitPrice": 28000, "addons": [] },
    { "name": "Smash Burger", "qty": 2, "unitPrice": 42000, "addons": [
      { "name": "Bekon", "price": 10000 }
    ]}
  ],
  "pricingStrategies": [
    { "id": "standard", "label": "Chegirmasiz", "discount": 0 },
    { "id": "happyhour", "label": "Baxtli soat (20%)", "discount": 0.20 },
    { "id": "loyalty", "label": "Sodiq mijoz (10%)", "discount": 0.10 }
  ],
  "taxRate": 0.12
}
```

---

### 7. `/history` — Buyurtmalar tarixi (Manager)

**Maqsad:** Barcha yopilgan buyurtmalarni ko'rish va filtrlash.

**UI elementlar:**

```
┌────────────────────────────────────────────────────┐
│  BUYURTMALAR TARIXI                                │
├────────────────────────────────────────────────────┤
│  Sana: [2026-06-04]  Stol: [Barchasi ▼]  [Qidirish]│
├────────┬────────┬──────────┬──────────┬────────────┤
│ Buyurt.│  Stol  │ Ofitsiant│  Jami    │   Holat    │
├────────┼────────┼──────────┼──────────┼────────────┤
│ORD-042 │  3     │ Sardor   │ 109,312  │ Yopilgan   │
│ORD-041 │  7     │ Malika   │  87,500  │ Yopilgan   │
│ORD-040 │  1     │ Sardor   │  45,000  │ Bekor      │
├────────┴────────┴──────────┴──────────┴────────────┤
│  Umumiy daromad: 196,812 so'm   Buyurtmalar: 3     │
└────────────────────────────────────────────────────┘
```

**Filtrlar:**
- Sana oralig'i
- Stol raqami
- Ofitsiant
- Holat (Yopilgan / Bekor qilingan)

**Mock data:**
```json
[
  {
    "id": "ORD-042",
    "tableNumber": 3,
    "waiter": "Sardor",
    "total": 109312,
    "status": "Closed",
    "timestamp": "2026-06-04T18:45:00",
    "items": ["Caesar Salat x1", "Smash Burger x2"]
  },
  {
    "id": "ORD-041",
    "tableNumber": 7,
    "waiter": "Malika",
    "total": 87500,
    "status": "Closed",
    "timestamp": "2026-06-04T17:30:00",
    "items": ["Margherita x2", "Limonad x2"]
  },
  {
    "id": "ORD-040",
    "tableNumber": 1,
    "waiter": "Sardor",
    "total": 45000,
    "status": "Cancelled",
    "timestamp": "2026-06-04T17:00:00",
    "items": ["Cheesecake x2"]
  }
]
```

---

### 8. `/reservations` — Bronlar (Manager + Ofitsiant)

**Maqsad:** Mavjud bronlarni ko'rish va yangi bron qo'shish.

**UI elementlar:**

```
┌─────────────────────────────────────────────────┐
│  BRONLAR                    [+ Yangi bron]      │
├─────────────────────────────────────────────────┤
│  Bugun — 2026-06-04                             │
├────────┬────────┬────────┬──────────┬───────────┤
│ Vaqt   │ Stol   │ Ism    │  Kishi   │   Holat   │
├────────┼────────┼────────┼──────────┼───────────┤
│ 19:00  │   3    │Aliyev  │    4     │ Kutilmoqda│
│ 19:30  │   5    │Karimov │    2     │ Kutilmoqda│
│ 20:00  │   8    │Rahimov │    6     │ Tasdiqlangan│
└────────┴────────┴────────┴──────────┴───────────┘
```

**"+ Yangi bron" modal:**
- Ism, telefon
- Sana va vaqt
- Kishi soni
- Stol tanlash (bo'sh stollar avtomatik ko'rinadi)
- Eslatma yozing (ixtiyoriy)

**Mock data:**
```json
[
  {
    "id": "RES-001",
    "guestName": "Aliyev A.",
    "phone": "+998901234567",
    "tableNumber": 3,
    "guests": 4,
    "time": "2026-06-04T19:00:00",
    "status": "Pending",
    "note": ""
  },
  {
    "id": "RES-002",
    "guestName": "Karimov B.",
    "phone": "+998907654321",
    "tableNumber": 5,
    "guests": 2,
    "time": "2026-06-04T19:30:00",
    "status": "Pending",
    "note": "Vegetarian menyu"
  }
]
```

---

## Komponent tuzilmasi (tavsiya)

```
src/
├── pages/
│   ├── Login.tsx
│   ├── Dashboard.tsx
│   ├── Tables.tsx
│   ├── TableDetail.tsx
│   ├── Kitchen.tsx
│   ├── Billing.tsx
│   ├── History.tsx
│   └── Reservations.tsx
│
├── components/
│   ├── layout/
│   │   ├── Sidebar.tsx          ← Rol asosida menyu
│   │   └── Header.tsx
│   ├── tables/
│   │   ├── TableCard.tsx        ← Bitta stol kartasi
│   │   └── TableGrid.tsx        ← Barcha stollar
│   ├── orders/
│   │   ├── MenuItemCard.tsx     ← Taom kartasi
│   │   ├── AddonModal.tsx       ← Qo'shimcha tanlash (Decorator)
│   │   ├── OrderCart.tsx        ← Buyurtma savati
│   │   └── OrderCard.tsx        ← Oshxona navbatidagi karta
│   ├── billing/
│   │   ├── PricingSelector.tsx  ← Chegirma tanlash (Strategy)
│   │   ├── BillSummary.tsx
│   │   └── SplitBillModal.tsx
│   └── shared/
│       ├── StatusBadge.tsx      ← Holat ko'rsatuvchi badge
│       ├── Button.tsx
│       └── Modal.tsx
│
├── data/
│   ├── tables.json
│   ├── menu.json
│   ├── orders.json
│   ├── history.json
│   └── reservations.json
│
└── hooks/
    ├── useOrders.ts
    ├── useTables.ts
    └── usePricing.ts
```

---

## Dizayn talablari

- **Rang palitri:**
  - Asosiy: `#1a1a2e` (to'q ko'k-qora)
  - Accent: `#e94560` (qizil)
  - Fon: `#16213e`
  - Karta foni: `#0f3460`
  - Matn: `#ffffff`

- **Shrift:** Inter yoki Poppins (Google Fonts)
- **Responsive:** Desktop birinchi, lekin tablet uchun ham ishlashi kerak
- **Ikonlar:** Lucide React yoki Heroicons

---

## Muhim texnik talablar

1. **Rol asosida marshrutlash** — har bir sahifa tegishli roldan boshqa roldagilar uchun yopilsin (`localStorage` da `role` bo'lmasa → `/login`)
2. **Holat boshqaruvi** — `useState` yoki `useReducer` (Redux shart emas)
3. **Mock data fayllar** — hamma ma'lumot `src/data/` papkada JSON fayllarda
4. **API tayyor joy** — har bir data chaqiruvida `// TODO: replace with API call` kommentariyasi bo'lsin, shunda backend ulanganda oson almashtirilsin
5. **Loading holat** — ma'lumot yuklanayotganda skeleton yoki spinner ko'rsatilsin
6. **Error holat** — xatolik bo'lganda foydalanuvchiga xabar

---

## Backend ulanganda o'zgaradigan joylar

Frontend developer shu joylarda API endpointlarini kutsin:

| Endpoint (kelgusida) | Hozircha |
|---|---|
| `GET /api/tables` | `tables.json` |
| `POST /api/orders` | `localStorage`ga yoz |
| `GET /api/menu` | `menu.json` |
| `PATCH /api/kitchen/:id` | Local state |
| `POST /api/billing/close` | Local state |
| `GET /api/history` | `history.json` |
| `POST /api/reservations` | `localStorage`ga yoz |

---

## Topshirish talablari (Frontend)

```
project/
├── src/              ← Barcha kod
├── public/
├── package.json
├── README.md         ← O'rnatish: npm install && npm run dev
└── screenshots/      ← Har sahifadan 1 ta screenshot
```

**README.md da bo'lishi kerak:**
- Loyiha haqida 2-3 jumlada tavsif
- O'rnatish va ishga tushirish (`npm install`, `npm run dev`)
- Qaysi sahifalar mavjud
- Tizimga kirish uchun qaysi rol tanlansin (demo uchun)

---

*BitePlate SRMS | Frontend TZ | 2026-06-04*