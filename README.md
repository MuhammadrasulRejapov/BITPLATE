# BitePlate — Smart Restaurant Management System

**BTEC Level 5 Higher National | Unit 27: Advanced Programming | Y/615/1651**

---

## Language & IDE Justification

This project is implemented in **C# (.NET 8)** for the backend and **TypeScript (React 19)** for the frontend.

C# was chosen because its strongly-typed, object-oriented nature maps directly to the design patterns required by this assignment. Features such as `interface`, `abstract class`, `sealed class`, and `Lazy<T>` allow precise, idiomatic implementation of Singleton, Command, Strategy, and other GoF patterns without language-level workarounds. .NET 8's built-in dependency-injection container also makes it straightforward to register and compose pattern participants (Observers, Invokers, Facades) with the correct lifetimes (Singleton, Scoped).

TypeScript was chosen for the frontend because its static typing enforces the same discipline as the backend — every API response and component prop is explicitly typed, reducing integration errors. React's component model mirrors the Decorator pattern: base components are wrapped with additional behaviour (loading states, role guards) at the composition level.

The project was developed in **Visual Studio Code** with the C# Dev Kit and ESLint extensions. Docker Compose is used to run the full stack (frontend, backend, PostgreSQL) with a single command, which satisfies the assignment's requirement that the application be reproducible from source.

---

## Prerequisites

- [Docker](https://www.docker.com/products/docker-desktop) (version 20+)
- [Docker Compose](https://docs.docker.com/compose/) (bundled with Docker Desktop)

No other tools are required — .NET SDK and Node.js are only needed if you want to run services outside Docker.

---

## Setup & Run

```bash
# 1. Clone or extract the project
cd BitePlate

# 2. Start all services (first run builds images — takes ~2 minutes)
docker compose up --build

# 3. Open the application
# Frontend:  http://localhost:3000
# Backend API: http://localhost:5000
```

To stop:
```bash
docker compose down
```

To reset the database completely:
```bash
docker compose down -v
docker compose up --build
```

---

## Demo Login Credentials

| Role | Username | Password | Default page |
|---|---|---|---|
| Manager | `manager` | `manager123` | `/dashboard` |
| Waiter | `sardor` | `sardor123` | `/tables` |
| Chef | `chef1` | `chef123` | `/kitchen` |
| Cashier | `cashier1` | `cash123` | `/billing` |

---

## Key Features

| Feature | Pattern(s) Used |
|---|---|
| Kitchen queue — advance & undo actions | **Command** (`PrepareOrderCommand`, `CancelOrderCommand`) |
| Order status & table lifecycle | **State** (Free → Occupied → AwaitingBill → Cleared) |
| Real-time notifications to staff | **Observer** (`OrderEventBus`, `KitchenObserver`, `WaiterObserver`) |
| Dynamic pricing & discounts | **Strategy** (Standard, HappyHour, Loyalty + free drink, Group) |
| Meal add-ons & customisation | **Decorator** (`AddonDecorator` stacked on `BaseMealItem`) |
| Global audit log | **Singleton** (`OrderHistoryLog` — thread-safe, `Lazy<T>`) |
| History traversal & reporting | **Iterator** (`FilteredHistoryIterator`) |
| Billing calculation | **Facade** (`BillingFacade` — tax, tip, split, discount in one call) |
| Combo / set meals | **Composite** (`ComboMealGroup` + `SingleMenuItem`) |
| Menu item creation | **Factory Method** (`StandardMealFactory`, `ComboMealFactory`) |

---

## Project Structure

```
BitePlate/
├── backend/BitePlate.API/
│   ├── Controllers/          # 9 REST controllers
│   ├── Data/                 # EF Core DbContext + DbSeeder
│   ├── Domain/               # Entities, Enums
│   ├── Patterns/             # 10 design pattern implementations
│   │   ├── Command/          # ICommand, PrepareOrderCommand, CancelOrderCommand, KitchenCommandInvoker
│   │   ├── Observer/         # OrderEventBus, IOrderObserver, KitchenObserver, WaiterObserver
│   │   ├── State/            # ITableState, FreeState, ReservedState, OccupiedState, ...
│   │   ├── Strategy/         # IPricingStrategy + 4 concrete strategies
│   │   ├── Decorator/        # IMealComponent, BaseMealItem, AddonDecorator
│   │   ├── Singleton/        # OrderHistoryLog
│   │   ├── Iterator/         # FilteredHistoryIterator
│   │   ├── Facade/           # BillingFacade, BillResult
│   │   ├── Composite/        # IMenuComponent, SingleMenuItem, ComboMealGroup
│   │   └── Factory/          # MealItemFactory, StandardMealFactory, ComboMealFactory
│   └── Services/             # 8 business logic services
│
├── frontend/
│   └── src/app/
│       ├── pages/            # 10 pages (Login, Dashboard, Tables, Kitchen, Billing, ...)
│       ├── context/          # AuthContext (JWT), AppDataContext (polling)
│       └── api/client.ts     # All API calls + TypeScript DTOs
│
└── docker-compose.yml
```

---

## API Endpoints (selected)

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/login` | Authenticate, receive JWT |
| GET | `/api/tables` | All tables with status |
| POST | `/api/tables/{id}/seat` | Seat guests (State: Free → Occupied) |
| POST | `/api/orders` | Create new order |
| POST | `/api/kitchen/{id}/advance` | Advance order status (Command) |
| POST | `/api/kitchen/{id}/undo` | Undo last kitchen action |
| GET | `/api/billing/strategies` | List pricing strategies |
| POST | `/api/billing/{id}/preview` | Preview bill with chosen strategy |
| POST | `/api/billing/{id}/close` | Close bill, archive to history (Singleton) |
| GET | `/api/history` | Full order history (Iterator) |
| GET | `/api/history/table/{n}` | History for specific table (Singleton query) |
| GET | `/api/history/top-item` | Most frequently ordered item (Singleton query) |
| GET | `/api/menu/addon-preview` | Preview Decorator stacking for add-ons |
| GET | `/api/menu/combos` | Composite meal groups |

---

## Screenshots

Screenshots of the running application are in the `screenshots/` folder:

| File | Feature | Pattern(s) demonstrated |
|---|---|---|
| `01_login.png` | Login page with 4 demo roles | JWT auth, role-based routing |
| `02_dashboard.png` | Manager dashboard — live stats | Observer polling, Singleton aggregate |
| `03_tables.png` | Table grid — all 12 tables with live status | State pattern (Free/Reserved/Occupied/AwaitingBill/Cleared) |
| `04_kitchen.png` | Kitchen queue — Advance & Cancel buttons | Command pattern (PrepareOrderCommand, CancelOrderCommand) |
| `05_billing.png` | Billing page — itemised bill with strategy selector | Strategy + Facade (Standard/HappyHour/Loyalty/Group) |
| `06_history.png` | Order history — date filter, revenue total | Iterator pattern + Singleton (OrderHistoryLog) |

---

*See `EVALUATION.md` for a critical evaluation of design pattern choices, trade-offs, and scalability considerations.*
