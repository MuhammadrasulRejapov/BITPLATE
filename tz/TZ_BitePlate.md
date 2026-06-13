# BitePlate — Smart Restaurant Management System
## Texnik Topshiriq (TZ)
### BTEC Level 5 | Unit 27: Advanced Programming | Y/615/1651

---

## Loyiha haqida umumiy ma'lumot

| Maydon | Ma'lumot |
|---|---|
| Loyiha nomi | BitePlate Smart Restaurant Management System (SRMS) |
| Turi | Individual Portfolio (4 haftalik) |
| Daraja | BTEC Level 5 Higher National |
| Topshirish muddati | 4-hafta oxiri (o'qituvchi ko'rsatmasiga ko'ra) |
| Dasturlash tili | Talaba tanlaydi (Java, Python, C#, C++ va h.k.) — tanlovi asoslanishi kerak |
| Yozma ish hajmi | Taxminan 2,000–2,800 so'z (barcha yozma topshiriqlar bo'yicha) |

---

## Stsenariy

Siz texnologiya konsalting kompaniyasidagi **junior dasturchi** sifatida ishlayapsiz. Birinchi mijozingiz — **BitePlate** restoran tarmog'i. Ular qog'oz-asosli va eskirgan jarayonlarni zamonaviy dasturiy tizim bilan almashtirmoqchi.

Sizning vazifangiz: **OOP prinsiplari** va **dizayn patternlar** asosida BitePlate tizimining prototipini **loyihalash, hujjatlashtirish va implement qilish**.

---

## Tizim modullari (nima qurilishi kerak)

### 1. Stol boshqaruvi (Table Management)
- Har bir stolning holati kuzatilishi kerak
- Holat sikli: `Free → Reserved → Occupied → Awaiting Bill → Cleared`
- Stol bo'shmi yoki bandmi — real vaqtda ko'rinishi kerak

### 2. Bron tizimi (Reservation System)
- Mijozlar stol oldindan bronh qila olishi kerak
- Bron tasdiqlanganda xodimga bildirishnoma yuborilishi kerak
- Eslatma (reminder) xabari ham yuborilishi kerak

### 3. Buyurtma boshqaruvi (Order Management)
- Ofitsiant buyurtma qabul qilib, oshxonaga yuboradi
- Tayyorlanishdan oldin buyurtmani o'zgartirish yoki bekor qilish mumkin

### 4. Oshxona navbati (Kitchen Queue)
- Buyurtmalar navbat asosida bajariladi
- Buyurtmalarni qayta tartib qilish va oxirgi amalni bekor qilish (undo) imkoniyati bor

### 5. Taom sozlash (Meal Customisation)
- Mijoz taomga qo'shimchalar, o'rnini bosuvchilar va allergiya talablarini qo'sha oladi
- Masalan: "Salatga piyoz qo'shma", "Gluten yo'q" va h.k.

### 6. Combo/Set Meal
- Bir nechta taomdan iborat to'plamlar bor
- Alohida taom va combo to'plam bir xil usulda ko'rinishi va hisoblanishi kerak

### 7. Narx va chegirma tizimi (Pricing & Discount Engine)
- Narx hisoblash algoritmi vaqtga, mijoz turiga yoki guruh kattaligiga qarab **real vaqtda** o'zgartirilishi mumkin
- Masalan: Baxtli soat (Happy Hour), Sodiq mijoz (Loyalty Card), Guruh chegirmasi

### 8. Buyurtmalar tarixi (Order History & Audit Log)
- Barcha buyurtmalar yagona global jurnalda saqlanadi
- Har bir yozuv: buyurtma ID, stol №, xodim ID, taomlar, umumiy summa, vaqt damgasi
- Menejer uchun hisobot va tahlil

### 9. Hisob-kitob / Kassa (Billing & POS)
- Batafsil chek generatsiyasi
- Uchburchak hisob (split bill) imkoniyati
- Tip qo'shish
- Soliq to'g'ri hisoblanishi

### 10. Xodimlar roli (Staff Role Management)
- Turli rollar turli huquqlarga ega:
  - **Manager** — hamma narsaga kirish
  - **Head Chef** — oshxona navbatini boshqarish, billing'ga kirish yo'q
  - **Waiter** — buyurtma qabul qilish, oshxona navbatini ko'rish
  - **Cashier** — faqat billing ko'rish va yopish

---

## 10 ta Dizayn Pattern — mos keladigan funksiyalar

| Pattern | Kategoriya | Qayerda ishlatiladi | Maqsad |
|---|---|---|---|
| **Command** | Behavioural | Oshxona navbati | Har bir amalni (Prepare, Cancel, Expedite) obyekt sifatida saqlash; undo/redo |
| **Observer** | Behavioural | Ofitsiant bildirishnomasi | Buyurtma holati o'zgarganda xodimga avtomatik xabar yuborish |
| **Strategy** | Behavioural | Narx/chegirma tizimi | Narx algoritmini real vaqtda almashtirish |
| **State** | Behavioural | Stol va buyurtma sikli | Holat o'tishlarini aniq modellashtirish |
| **Factory Method** | Creational | Taom yaratish | Starter, Main, Dessert, Beverage obyektlarini to'g'ri sinf yaratadi |
| **Singleton** | Creational | Buyurtmalar jurnali | Butun tizimda faqat bitta global jurnal obyekti |
| **Iterator** | Behavioural | Tarixni ko'rib chiqish | Tarix yozuvlarini bir xil usulda aylanib chiqish |
| **Decorator** | Structural | Taom sozlash | Istalgan taomga qo'shimcha (allergiya, maxsus pishirish) dinamik qo'shish |
| **Facade** | Structural | Billing & POS interfeysi | Murakkab hisob-kitob logikasini bitta oddiy interfeysga yashirish |
| **Composite** | Structural | Combo/Set Meal | Alohida taom va combo to'plamni bir xil tarzda ko'rsatish va hisoblash |

> **Eslatma:** Barcha 10 ta patterni implement qilish shart emas. Quyidagi topshiriqlarda minimum talablar ko'rsatilgan.

---

## Topshiriqlar (Tasks) — batafsil

---

### TASK 1 — OOP va Dizayn Patternlar Hisoboti
**O'quv natijasi:** LO1
**Hajm:** 900–1,300 so'z (kod/psevdokod so'z hisobiga kirmaydi)

---

#### Bo'lim 1a — OOP Paradigmasi xususiyatlari (Pass)

Quyidagi 6 ta OOP tushunchaning har biri uchun:
1. Aniq tushuntirish bering
2. BitePlate tizimidan qisqa kod misoli yoki stsenariy keltiring

| OOP Tushuncha | BitePlate misoli |
|---|---|
| **Encapsulation** | Billing summalari yoki mijoz ma'lumotlari qanday himoyalanadi? |
| **Polymorphism** | Bitta metod chaqiruvi Starter, Main Course yoki Dessert obyektini qanday boshqaradi? |
| **Inheritance** | Xodim rollari yoki taom turlari umumiy xatti-harakatni qanday meros qilib oladi? |
| **Abstraction** | Tizimda qaysi abstract sinflar yoki interfeyslar shartnomalarni belgilaydi? |
| **Constructor/Destructor** | Restoran sessiyasida obyektlar qanday initsializatsiya va tozalanadi? |
| **Generics/Containers** | Qayerda typed kolleksiyadan foydalaniladi? (masalan, buyurtmalar navbati yoki taomlar ro'yxati) |

---

#### Bo'lim 1b — OOP Sinf Munosabatlari (Pass)

Quyidagi 5 ta munosabat turining har biri uchun tushuntirish va BitePlate'dan konkret misol:

| Munosabat | BitePlate misoli |
|---|---|
| **Generalization/Inheritance** | `MenuItem → Starter, Main, Dessert` |
| **Realisation** | Sinf `Printable` yoki `Taxable` interfeysini implement qiladi |
| **Dependency** | `Waiter` sinfi `OrderService`ga bog'liq |
| **Aggregation** | `Table` — `Order`lar kolleksiyasini saqlaydi |
| **Composition** | `Bill` — `BillLineItem`lardan tashkil topgan, ular mustaqil mavjud bo'la olmaydi |

---

#### Bo'lim 1c — Dizayn Pattern Tahlili (Pass / Merit / Distinction)

3-bo'limdagi jadvaldan har kategoriyadan **1 ta pattern** tanlang va tasvirlang:

- **Creational** — qanday muammoni hal qiladi, asosiy ishtirokchilar, nima uchun BitePlate'ga mos?
- **Structural** — sinflar va obyektlarni katta tuzilmalarga qanday tashkil qiladi?
- **Behavioural** — obyektlar o'rtasida muloqot va javobgarlikni qanday boshqaradi?

**Merit uchun:** Har bir patternning kelishuvlarini (trade-off) baholang — nima yutadi, qanday murakkablik kiritadi?

**Distinction uchun:** OOP prinsiplari (ayniqsa abstraktsiya va polimorfizm) dizayn patternlarni qayta ishlatiluvchi va til-agnostik qiladigan asos ekanligini 250–350 so'zda tahlil qiling. Tanlagan 2 ta patternni aniq keltiring.

---

#### Bo'lim 1d — Ochiq savollar (Barcha darajalar — o'z yechimingizni taklif qiling)

Har bir savol uchun 100–150 so'zlik javob yozing. Qaysi OOP texnikasi yoki dizayn patterni ishlatishingizni va nima uchun ekanligini taklif qiling.

**A — Allergiya ogohlantirish tizimi**
Mijoz allergiya belgisi bilan taomga buyurtma beradi. Tizim darhol oshxonani, ofitsiantni va menejerni ogohlantirishi kerak. Kelajakda mavjud kodni o'zgartirmasdan yangi oluvchilar qo'shilishi mumkin bo'lishi kerak. Qaysi pattern yoki OOP mexanizmi?

**B — Dinamik taom narxi**
"Sokin soatlar" rejimi — 15:00–17:00 orasida barcha taomlar 20% chegirma. Shanba kechasi "hafta oxiri qo'shimcha narxi". Qolgan vaqtlarda standart narx. Kelajakda yangi narx rejimi qo'shish minimal o'zgarish talab qilishi kerak. Qanday loyihalarsiz?

**C — Buyurtmalar tarixini tahlil qilish**
Menejer so'nggi 30 kunda eng ko'p buyurtma berilgan top-10 taom, har bir stol uchun o'rtacha xarajat va eng yuklangan soat ko'rishni xohlaydi. Ma'lumot buyurtmalar jurnalidan keladi. Jurnalni qanday tuzasiz? Qaysi pattern jurnalning o'zini boshqaradi va hisobot uchun yozuvlarni qanday aylanib chiqasiz?

**D — Eskirgan oshxona ekrani**
BitePlate uch yil oldin sotib olingan oshxona displey ekraniga ega. Uning dasturiy ta'minoti sizning tizimingizdan butunlay farqli interfeysi bor. Ishlab chiqaruvchi SDK'ni yangilamaydi. BitePlate sizning tizimingiz displey dasturiy ta'minotini qayta yozmay buyurtmalarni shu ekranga yuborishini xohlaydi. Qaysi struktural pattern buni hal qiladi?

**E — Xodimlar ruxsatlari tizimi**
Turli rollar turli darajadagi kirish huquqiga ega: Kassir hisoblarni ko'rish va yopishi mumkin, lekin oshxona buyurtmalarini o'zgartira olmaydi; Bosh oshpaz oshxona navbatini qayta tartib qila oladi, lekin billingga kira olmaydi; Menejer hamma narsani qila oladi. OOP yordamida qanday modellashtirish kerak?

---

### TASK 2 — UML Diagrammalar
**O'quv natijasi:** LO2
**Vosita:** Draw.io, Lucidchart, PlantUML, StarUML yoki ekvivalent
**Format:** PNG yoki PDF, izohlar bilan birga

---

#### 2a — Asosiy tizim sinf diagrammasi (Pass)

Kamida quyidagi sinflarni o'z ichiga olsin:

```
MenuItem
├── Starter
├── MainCourse
├── Dessert
└── Beverage

ComboMeal / SetMeal  ←→  MenuItem (munosabat ko'rsating)

Order ←→ OrderItem

Table ←→ Reservation, Order

Staff
├── Waiter
├── Chef
├── Cashier
└── Manager

OrderHistoryLog  (Singleton — tegishli notatsiya bilan)

Bill ←→ BillLineItem
```

**UML notatsiyasi talablari:**
- Ko'rinish modifikatorlari: `+` (public), `-` (private), `#` (protected)
- Atribut turlari
- Metod imzolari
- Ko'paytirishlar (multiplicities)
- Barcha 5 ta munosabat turi (mavjud bo'lganda)

---

#### 2b — Dizayn Pattern Sinf Diagrammalari (Merit)

**Command Pattern** uchun alohida diagramma:
- `Command` interfeysi
- Konkret komandalar: `PrepareOrderCommand`, `CancelOrderCommand`
- Invoker: `KitchenQueue`
- Receiver: `Chef`

**Observer Pattern** uchun alohida diagramma:
- `Subject` interfeysi
- Konkret subject: `Order`
- `Observer` interfeysi
- Konkret observerlar: `WaiterNotifier`, `ManagerDashboard`, `KitchenDisplay`

Har bir diagramma uchun 3–5 ta izoh: qaysi ishtirokchi qaysi BitePlate sinfiga mos keladi va nima uchun.

**Qo'shimcha:** Qolgan patternlardan o'zingiz tanlagan birta uchun diagramma chizing. Tanlovingizni asoslang.

---

#### 2c — UML Faoliyat Diagrammalari (Pass + Merit)

Quyidagi 2 ta ish oqimi uchun alohida activity diagram chizing. **Swimlane**lar bilan: Kim (Mijoz, Ofitsiant, Oshxona, Tizim) har bir amalni bajaradi.

**Faoliyat Diagrammasi 1 — To'liq buyurtma sikli:**
Mijoz o'tirishidan to hisob-kitob yopilishigacha:
- Stol tayinlash
- Buyurtma qabul qilish
- Oshxona navbatiga kiritish
- Tayyorlash bosqichlari
- Xizmat qilish
- Hisob generatsiyasi
- To'lov
- Stolni tozalash

Qaror nuqtalari: (masalan, tayyorlanishdan oldin buyurtma o'zgartirish, to'lov usuli tanlash) va parallel oqimlar.

**Faoliyat Diagrammasi 2 — Buyurtma tarixi yozish va so'rovi:**
- Buyurtma tasdiqlanishi
- Singleton jurnalga yozilishi
- Menejer hisobot so'rovi
- Iterator yozuvlarni aylanib chiqishi
- Tahlil natijasi generatsiyasi

---

#### 2d — Koddan Diagramma Chiqarish (Distinction)

O'qituvchi 2-haftada ~30–50 qatorlik kod parchasi beradi. Siz:
1. O'sha koddan UML sinf diagrammasini teskari muhandislik qilasiz
2. 150–200 so'zlik izoh yozasiz: qanday munosabatlar aniqlandi, qaysi pattern sezildi, kontekst yo'qligi sababli qanday taxminlar qilindi

---

### TASK 3 — Kod implementatsiyasi
**O'quv natijasi:** LO3

Tanlangan dasturlash tilida BitePlate tizimining ishlaydigan prototipini quring. README'da til va IDE tanlovi bir paragrafda asoslanishi kerak.

---

#### 3a — Asosiy ilova (Pass)

Task 2a dagi sinf diagrammasidan sinflarni implement qiling. Ilova:

- Encapsulation, polymorphism, inheritance va kamida bir interfeys/abstract sinfni namoyish etsin
- Foydalanuvchi (konsol yoki oddiy GUI orqali) quyidagilarni bajara olsin:
  - Mijozni stolga o'tkazish
  - Bir nechta taomli buyurtma berish
  - Oshxona navbatini ko'rish
  - Hisob generatsiya qilish
- Xavfsiz kodlash amaliyotlari:
  - Barcha foydalanuvchi kirishlarini validatsiya qilish
  - Exception'larni to'g'ri boshqarish
  - Muhim qiymatlari (parollar, kalitlar) kod ichida qattiq yozilmasin

---

#### 3b — Dizayn Pattern Implementatsiyasi (Merit)

Quyidagi **3 ta patternni** implement qiling:

**Pattern 1 — Command (Oshxona navbati)**
```
Interface Command:
  + execute(): void
  + undo(): void

ConcreteCommands:
  PrepareOrderCommand
  CancelOrderCommand

Invoker:
  KitchenQueue — komandalar tarixini saqlaydi, oxirgi amalni undo qiladi
```

**Pattern 2 — Singleton (Buyurtmalar tarixi jurnali)**
```
OrderHistoryLog — faqat bir marta yaratilishi mumkin

Har bir tasdiqlangan buyurtma quyidagilar bilan yoziladi:
  - buyurtma ID
  - stol raqami
  - xodim ID
  - taomlar
  - umumiy summa
  - vaqt damgasi

Menejer uchun metodlar:
  - ma'lum sana oralig'idagi barcha buyurtmalar
  - ma'lum stol bo'yicha buyurtmalar
  - eng ko'p buyurtma berilgan taom
```

**Pattern 3 — Strategy (Narx/Chegirma tizimi)**
```
Interface PricingStrategy:
  + calculateTotal(order): decimal

Konkret strategiyalar:
  StandardPricing
  HappyHourPricing      → 20% chegirma
  LoyaltyCardPricing    → 10% chegirma + bepul ichimlik

Hisoblash tizimi (Bill sinfi) o'zgartirmasdan
strategiyani real vaqtda almashtirib turishi kerak
```

**Uchta pattern birgalikda ishlashi kerak:**
```
1. Ofitsiant buyurtma beradi            → Command pattern
2. Strategiya chegirmali narxni hisoblaydi → Strategy pattern
3. Tasdiqlangan buyurtma jurnalga yoziladi → Singleton pattern
```

---

#### 3c — Texnik Baholash (Distinction)

`EVALUATION.md` faylida 300–400 so'z:
- Tanlagan 3 ta pattern o'z muammolari uchun eng yaxshi tanlovmi? Qaysi alternativlarni ko'rib chiqdingiz?
- Singleton implementatsiyangizning kamchiliklari — ayniqsa testlash imkoniyati va thread-safety bo'yicha
- Tizim 50 ta restoran va umumiy markaziy ma'lumotlar bazasiga o'sgan taqdirda qaysi dizayn qarorlaringiz o'zgarishi kerak va qanday?

**Topshirish talablari:**
- Barcha manba fayllari ZIP arxivda
- `README.md` — o'rnatish va ishga tushirish yo'riqnomasi
- `EVALUATION.md`
- Asosiy funksiyalarni ko'rsatuvchi kamida 4 ta screenshot

---

### TASK 4 — Dizayn Pattern Stsenariy Tahlili
**O'quv natijasi:** LO4
**Hajm:** 700–1,000 so'z (diagrammalar/psevdokod qo'shilishi mumkin)

Har bir stsenariy uchun:
- Tavsiya etilgan dizayn pattern(lar) va asoslash
- Ko'rib chiqilgan alternativ patternlar va nima uchun tanlanmagani
- **(Merit)** Pattern maqsadi va muammo o'rtasidagi aniq, asoslangan bog'liqlik
- **(Distinction)** Bir stsenariy uchun kamida 2 ta raqobatchi pattern tanqidiy taqqoslash va yakuniy asoslangan tavsiya

---

**Stsenariy A — Kengayuvchi menyu (Build Your Own Burger)**
- Mijoz asosiy pattisni tanlaydi, keyin mustaqil ravishda garnish, souslar va yon taomlar qo'shadi/olib tashlaydi
- 200+ mumkin bo'lgan kombinatsiya
- Yangi garnishlar mavsumiy qo'shiladi
- Tizim to'g'ri narxni hisoblashi va mijoz hamda oshxona uchun aniq xulosa ko'rsatishi kerak
- **Savol:** Yuzlab subklass yaratmasdan MenuItem sinf ierarxiyasini qanday tuzish kerak?

**Stsenariy B — Bron Eslatma Quvuri (Reservation Reminder Pipeline)**
- Mijoz bron qilganda tizim quyidagilarni bajarishi kerak:
  - Tasdiqlash SMS yuborish
  - Menejer kalendariga qo'shish
  - Stol mavjudligi displeyini yangilash
  - Brondan 2 soat oldin eslatma SMS yuborish
- Har bir amal turli quyi tizim tomonidan bajariladi
- Bron mantig'ini o'zgartirmasdan yangi amallar qo'shish mumkin bo'lishi kerak
- **Savol:** Qaysi pattern yoki patternlar kombinatsiyasi?

**Stsenariy C — Franchayzing Rollout**
- 5 ta yangi franchayzing joyi ochilmoqda
- Har bir joy o'ziga xos menyu variatsiyalariga ega
  - Qirg'oq filialni: dengiz mahsulotlari bo'limi
  - Shahar markazi filialni: "grab and go" opsiyasi
- Asosiy tizim o'zgarmasdan qolishi kerak
- Bosh ofis franchayzing egalari asosiy kodni o'zgartirishini xohlamaydi
- **Savol:** Joylashuvga xos obyekt yaratishni boshqarish uchun qaysi creational pattern oilasi?

**Stsenariy D — Kechki Hisobot (End-of-Night Report)**
- Yopilish vaqtida menejer quyidagilarni ko'ruvchi hisobot ishga tushiradi:
  - Tarix jurnalidan barcha buyurtmalarni aylanib chiqish
  - Kategoriya bo'yicha umumiy daromad (taom vs ichimlik)
  - Xizmat qilgan mijozlar bo'yicha top-3 ofitsiant
  - Tayyorlanish boshlangandan keyin bekor qilingan buyurtmalar (isrof metrikasi)
  - Xulosani eksport qilish
- Tarix yuzlab yozuvni o'z ichiga olishi mumkin va ichki saqlash formati kelajakda o'zgarishi mumkin
- **Savol:** Saqlash formati o'zgarganda hisobot kodi buzilmasligi uchun aylanib chiqish va hisobot mantig'ini qanday tuzish kerak?

**Stsenariy E — Ko'p Ekranli Oshxona (Multi-Screen Kitchen)**
- Katta restoranlarda 3 ta oshxona stansiyasi bor:
  - **Issiq stansiya** — burger, steyk...
  - **Sovuq stansiya** — salat, sushi...
  - **Desert stansiyasi** — tortlar, muzqaymoq...
- Buyurtma oshxonaga yuborganda turli taomlar turli ekranlarga yo'naltirilishi kerak
- Bosh oshpaz barcha stansiyalardagi barcha faol buyurtmalarni ko'ruvchi master ekranga ega bo'lishi kerak
- Hozirda barcha oshxona komandalari bitta navbatga boradi
- **Savol:** Ofitsiant interfeysini oddiy va o'zgarishsiz saqlab, oshxona navbatini ko'p stansiyali yo'naltirish uchun qanday qayta loyihalash kerak?

---

### TASK 5 — Reflektiv Portfolio Jurnali
**O'quv natijasi:** Barcha LO
**Hajm:** 350–500 so'z
**Uslub:** 1-shaxs (men), shaxsiy, samimiy

Quyidagilarni yozma ravishda bayon qiling:
- Bu topshiriqda nima eng qiyin bo'ldi va qanday yengdingiz?
- Qaysi dizayn pattern intellektual jihatdan eng qiziqarli bo'ldi va nima uchun?
- Real dunyo stsenariysida (restoran tizimi) ishlash dasturiy ta'minot dizayni haqidagi fikringizni abstrak mashqlardan farqli ravishda qanday o'zgartirdi?
- Task 4 ochiq savollariga qarab: to'g'ri patternni aniqlashda chinakam qiynalgan stsenariy bormi? Bu jarayon sizning hozirgi tushunchangiz haqida nima ochib berdi?
- Yana bir hafta bo'lganida UML dizayningiz yoki kodingizda nima o'zgartirardingiz?

> **Muhim:** Jurnal haqiqiy tanqidiy fikrga baholanadi, uzunlikka emas. Nima qilganingizni emas — nima o'rgandingiz, nima sizni hayratga soldi, nima o'zgartirardingiz degan narsalarni yozing.

---

## Baholash jadvali

| Topshiriq | Pass | Merit | Distinction |
|---|---|---|---|
| **Task 1** OOP va Pattern Hisoboti | P1: OOP xususiyatlari va sinf munosabatlari | M1: Har kategoriyadan 1 ta pattern (3 ta) | D1: OOP paradigmasi va dizayn patternlar o'rtasidagi bog'liqlikni tahlil qilish |
| **Task 2** UML Diagrammalar | P2: UML vositasida sinf diagrammalari | M2: Aniq dizayn patternlar uchun sinf diagrammalari | D2: Kod parchadan diagramma chiqarish va asoslash |
| **Task 3** Kod Implementatsiyasi | P3: UML sinf diagrammasidan ilova qurish | M3: Ma'lum maqsad uchun dizayn pattern implement qiluvchi kod | D3: Dizayn patternlardan foydalanishni baholash |
| **Task 4** Stsenariy Tahlili | P4: Tegishli misollar bilan turli dizayn patternlarni muhokama qilish | M4: Har bir stsenariy uchun eng mos patternni aniq asoslash bilan moslash | D4: Barcha stsenariylarni asoslangan tavsiyalar bilan tanqidiy baholash |
| **Task 5** Reflektiv Jurnal | Barcha topshiriqlarni topshirish | Portfolio bo'ylab tanqidiy fikrlash sifati | Mustaqil fikrlash va o'z-o'zini baholash isboti |

**Muhim:** Merit yoki Distinction olish uchun pastki daraja barcha mezonlari ham bajarilgan bo'lishi kerak. Topshiriqda bir nechta daraja mezonlari bo'lsa, o'sha topshiriqda erishilgan eng yuqori daraja qayd etiladi.

---

## 4 haftalik jadval

| Hafta | Bosqich | Asosiy faoliyat | Topshiriq |
|---|---|---|---|
| **1-hafta** | Tadqiqot va Nazariya | OOP tushunchalarini o'rganing, 10 ta pattern BitePlate funksiyalariga map qiling. Task 1 hisobotini yozing: OOP paradigmasi xususiyatlari, sinf munosabatlari, har kategoriyadan bir pattern. Restoran kontekstidan psevdokod misollar keltiring. | Task 1 draftni topshirish |
| **2-hafta** | UML Dizayn | Asosiy tizim sinf diagrammasi (Task 2a). Kamida 2 ta pattern uchun pattern-specific sinf diagrammalari (Task 2b). Buyurtma sikli va oshxona navbati ish oqimlari uchun UML faoliyat diagrammalari. Barcha diagrammalarni aniq izoh bilan. | Task 2 barcha diagrammalar eksport va izoh bilan |
| **3-hafta** | Kod Implementatsiyasi | Dasturlash tili va IDE tanlang — README'da asoslang. UML diagrammalardan BitePlate ilovasini quring. Kamida 2 ta dizayn patterni kod bilan implement qiling. Xavfsiz kodlash: validatsiya, exception boshqaruv, hardcoded qiymatlar yo'q. Har bir funksiyani sinab, screenshtot oling. | Task 3: zip manba kodi + README + screenshtotlar |
| **4-hafta** | Baholash va Portfolio | Task 4 stsenariy tahlilini yozing: 5 ta ochiq stsenariyni tahlil qilib, dizayn pattern tavsiyalarini asoslang. Task 5 reflektiv jurnalni yozing. Barcha komponentlarni yakuniy portfolio sifatida ko'rib chiqing, tahrirlang va yig'ing. | Yakuniy portfolio o'quv platformasi orqali topshiriladi |

---

## Yakuniy portfolio tarkibi (barcha narsalar bo'lishi shart)

```
portfolio/
├── Task1_Report.pdf             ← OOP hisoboti + 5 ta ochiq savol
├── Task2_Diagrams/
│   ├── 2a_CoreSystem.png        ← Asosiy sinf diagrammasi
│   ├── 2b_Command.png           ← Command pattern diagrammasi
│   ├── 2b_Observer.png          ← Observer pattern diagrammasi
│   ├── 2b_Extra.png             ← O'zingiz tanlagan pattern
│   ├── 2c_Activity1.png         ← Buyurtma sikli faoliyat diagrammasi
│   ├── 2c_Activity2.png         ← Tarix so'rovi faoliyat diagrammasi
│   └── 2d_CodeDerived.png       ← Kod parchadan chiqarilgan diagramma
├── Task3_Code/
│   ├── src/                     ← Barcha manba fayllari
│   ├── README.md                ← O'rnatish va ishga tushirish
│   ├── EVALUATION.md            ← 300-400 so'z texnik baholash
│   └── screenshots/             ← Kamida 4 ta screenshot
├── Task4_Scenarios.pdf          ← Yoki Task1 hujjatida alohida bo'lim
└── Task5_Journal.pdf            ← Yoki yozma hujjatda yakuniy bo'lim
```

---

## Tavsiya etilgan resurslar

### Kitoblar
- **Design Patterns** — Gamma et al. (1994), Addison-Wesley *(GoF kitobi — klassik)*
- **Head First Design Patterns** — Freeman & Robson (2020), O'Reilly *(o'qish oson)*
- **Clean Code** — Robert C. Martin (2008), Prentice Hall
- **Effective Java** — Joshua Bloch (2018), Addison-Wesley

### Online resurslar
- **Refactoring.Guru** — https://refactoring.guru/design-patterns *(Java, Python, C#, C++ da misollar)*
- **SourceMaking** — https://sourcemaking.com/design_patterns
- **PlantUML** — https://plantuml.com *(matn-asosli UML, versiya boshqariladi)*
- **Draw.io** — https://app.diagrams.net *(bepul, hisob talab qilmaydi, boshlashga mos)*

### UML vositalari
| Vosita | Tavsif |
|---|---|
| **Draw.io** | Bepul, hisob talab qilmaydi, PNG/PDF eksport |
| **Lucidchart** | Bepul daraja, hamkorlik imkoniyati |
| **StarUML** | Bepul sinov, desktop ilova, sinf diagrammalarga yaxshi |
| **PlantUML** | Matn-asosli, VS Code va IntelliJ IDEA bilan integratsiya |

---

## Akademik yaxlitlik

- Barcha topshiriq **o'z ishingiz** bo'lishi kerak
- Barcha manbalar ro'yxati (Harvard uslubi tavsiya etiladi) ko'rsatilishi kerak
- Tengdoshlar, onlayn repozitoriyalar yoki AI vositalaridan kodni nusxalash — plagiat
- AI yordamchi vositalar (GitHub Copilot, ChatGPT) **faqat o'rganish uchun** ruxsat
- AI tomonidan yaratilgan kodni o'zgartirishsiz topshirish — akademik noto'g'ri xatti-harakat

---

*Unit 27: Advanced Programming | Y/615/1651 | BTEC Level 5*
