using BitePlate.API.Domain.Entities;
using BitePlate.API.Domain.Enums;
using BitePlate.API.Patterns.Composite;
using BitePlate.API.Patterns.Factory;
using BitePlate.API.Patterns.Singleton;
using Microsoft.EntityFrameworkCore;

namespace BitePlate.API.Data;

public static class DbSeeder
{
    /// <summary>
    /// Creates schema and seeds initial data on first run.
    /// Combo meals (Composite pattern) remain in-memory — they are static demo data.
    /// </summary>
    public static async Task SeedAsync(AppDbContext db)
    {
        await db.Database.EnsureCreatedAsync();

        if (!db.Users.Any())         SeedUsers(db);
        if (!db.Tables.Any())       SeedTables(db);
        if (!db.MenuItems.Any())    SeedMenu(db);
        if (!db.Orders.Any())       SeedOrders(db);
        if (!db.Reservations.Any()) SeedReservations(db);

        await db.SaveChangesAsync();

        // Add new columns to existing databases that were created before this version.
        // On fresh installs EnsureCreatedAsync already includes these columns; IF NOT EXISTS makes this idempotent.
        try
        {
            await db.Database.ExecuteSqlRawAsync(
                "ALTER TABLE order_history ADD COLUMN IF NOT EXISTS staff_id TEXT;");
            await db.Database.ExecuteSqlRawAsync(
                "ALTER TABLE order_history ADD COLUMN IF NOT EXISTS free_drink_value NUMERIC NOT NULL DEFAULT 0;");
        }
        catch { /* ignore — fresh DB already has the columns from EnsureCreatedAsync */ }

        if (!OrderHistoryLog.Instance.GetAll().Any())
            SeedHistory();
    }

    private static void SeedTables(AppDbContext db)
    {
        db.Tables.AddRange([
            new Table { Id=1,  Number=1,  Capacity=2, Status=TableStatus.Free },
            new Table { Id=2,  Number=2,  Capacity=4, Status=TableStatus.Occupied,     CurrentGuests=3, OccupiedSince="18:30", WaiterName="Sardor" },
            new Table { Id=3,  Number=3,  Capacity=6, Status=TableStatus.Reserved,     ReservationTime="20:00", GuestName="Aliyev A." },
            new Table { Id=4,  Number=4,  Capacity=4, Status=TableStatus.AwaitingBill, CurrentGuests=4 },
            new Table { Id=5,  Number=5,  Capacity=2, Status=TableStatus.Cleared },
            new Table { Id=6,  Number=6,  Capacity=8, Status=TableStatus.Free },
            new Table { Id=7,  Number=7,  Capacity=4, Status=TableStatus.Occupied,     CurrentGuests=4, OccupiedSince="19:15", WaiterName="Malika" },
            new Table { Id=8,  Number=8,  Capacity=6, Status=TableStatus.Free },
            new Table { Id=9,  Number=9,  Capacity=2, Status=TableStatus.Occupied,     CurrentGuests=2, OccupiedSince="19:45", WaiterName="Sardor" },
            new Table { Id=10, Number=10, Capacity=4, Status=TableStatus.Free },
            new Table { Id=11, Number=11, Capacity=4, Status=TableStatus.Free },
            new Table { Id=12, Number=12, Capacity=2, Status=TableStatus.Free },
        ]);
    }

    private static void SeedMenu(AppDbContext db)
    {
        // Factory Method pattern: StandardMealFactory creates each item
        var factory = new StandardMealFactory();
        db.MenuItems.AddRange([
            factory.CreateMenuItem("m1","Caesar Salat","Starter",28000,"Romaine, parmesan, crouton","🥗",["dairy","gluten"],[
                new MenuAddon { Id="a1", Name="Qo'shimcha pishloq", Price=5000  },
                new MenuAddon { Id="a2", Name="Tovuq qo'shish",     Price=12000 },
                new MenuAddon { Id="a3", Name="Gluten yo'q",        Price=0     }]),
            factory.CreateMenuItem("m2","Smash Burger","Main",42000,"Mol go'shtli burger","🍔",["gluten","dairy"],[
                new MenuAddon { Id="a4", Name="Qo'shimcha kotlet",  Price=18000 },
                new MenuAddon { Id="a5", Name="Bekon",              Price=10000 },
                new MenuAddon { Id="a6", Name="O'tkir sous",        Price=2000  }]),
            factory.CreateMenuItem("m3","Margherita Pizza","Main",45000,"Klassik italyan pitsasi","🍕",["gluten","dairy"],[
                new MenuAddon { Id="a10",Name="Qo'shimcha pishloq", Price=8000  },
                new MenuAddon { Id="a11",Name="Pepperoni",          Price=12000 },
                new MenuAddon { Id="a12",Name="Ko'katlar",          Price=5000  }]),
            factory.CreateMenuItem("m4","Grilled Salmon","Main",65000,"Panjara losos, ko'katlar bilan","🐟",["fish"],[
                new MenuAddon { Id="a13",Name="Limon sousi",            Price=3000 },
                new MenuAddon { Id="a14",Name="Qo'shimcha ko'katlar",   Price=5000 }]),
            factory.CreateMenuItem("m5","Cheesecake","Dessert",22000,"New York uslubidagi cheesecake","🍰",["dairy","eggs"],[
                new MenuAddon { Id="a7", Name="Meva sousi",  Price=5000 },
                new MenuAddon { Id="a15",Name="Shokolad",    Price=4000 }]),
            factory.CreateMenuItem("m6","Tiramisu","Dessert",25000,"Klassik italyan deserti","🍮",["dairy","eggs"],[]),
            factory.CreateMenuItem("m7","Limonad","Beverage",15000,"Yangi siqilgan limon","🍋",[],[
                new MenuAddon { Id="a8",Name="Qand yo'q",   Price=0 },
                new MenuAddon { Id="a9",Name="Muz ko'proq", Price=0 }]),
            factory.CreateMenuItem("m8","Kofe Americano","Beverage",12000,"Klassik qora kofe","☕",[],[
                new MenuAddon { Id="a16",Name="Sut qo'shish",Price=3000 },
                new MenuAddon { Id="a17",Name="Qand",        Price=0    }]),
            factory.CreateMenuItem("m9","Fresh Orange Juice","Beverage",18000,"Yangi siqilgan apelsin sharbati","🍊",[],[]),
        ]);
    }

    private static void SeedOrders(AppDbContext db)
    {
        db.Orders.AddRange([
            new Order { Id="ORD-042", TableNumber=3, Time="18:45", Status=OrderStatus.Pending,   Waiter="Sardor",
                Items=[
                    new OrderItem { MenuItemId="m1", Name="Caesar Salat", Qty=1, Price=28000, Addons=[] },
                    new OrderItem { MenuItemId="m2", Name="Smash Burger",  Qty=2, Price=42000,
                        Addons=[ new OrderAddon{Name="Bekon",Price=10000}, new OrderAddon{Name="O'tkir sous",Price=2000} ]}]},
            new Order { Id="ORD-043", TableNumber=7, Time="18:52", Status=OrderStatus.Preparing, Waiter="Malika",
                Items=[
                    new OrderItem { MenuItemId="m2", Name="Smash Burger", Qty=2, Price=42000,
                        Addons=[ new OrderAddon{Name="Qo'shimcha kotlet",Price=18000} ]},
                    new OrderItem { MenuItemId="m7", Name="Limonad", Qty=1, Price=15000,
                        Addons=[ new OrderAddon{Name="Muz ko'proq",Price=0} ]}]},
            new Order { Id="ORD-044", TableNumber=2, Time="19:10", Status=OrderStatus.Ready,     Waiter="Sardor",
                Items=[
                    new OrderItem { MenuItemId="m3", Name="Margherita Pizza", Qty=1, Price=45000, Addons=[] },
                    new OrderItem { MenuItemId="m7", Name="Limonad",           Qty=2, Price=15000, Addons=[] }]},
            new Order { Id="ORD-045", TableNumber=9, Time="19:45", Status=OrderStatus.Served,    Waiter="Sardor",
                Items=[
                    new OrderItem { MenuItemId="m5", Name="Cheesecake",    Qty=2, Price=22000,
                        Addons=[ new OrderAddon{Name="Meva sousi",Price=5000} ]},
                    new OrderItem { MenuItemId="m8", Name="Kofe Americano",Qty=2, Price=12000, Addons=[] }]},
        ]);
    }

    private static void SeedUsers(AppDbContext db)
    {
        db.Users.AddRange([
            new User { Username="manager",  PasswordHash=BCrypt.Net.BCrypt.HashPassword("manager123"), Role="Manager",  DisplayName="Bosh Menejer" },
            new User { Username="sardor",   PasswordHash=BCrypt.Net.BCrypt.HashPassword("sardor123"),  Role="Waiter",   DisplayName="Sardor Yusupov" },
            new User { Username="malika",   PasswordHash=BCrypt.Net.BCrypt.HashPassword("malika123"),  Role="Waiter",   DisplayName="Malika Karimova" },
            new User { Username="chef1",    PasswordHash=BCrypt.Net.BCrypt.HashPassword("chef123"),    Role="Chef",     DisplayName="Oshpaz Akbar" },
            new User { Username="cashier1", PasswordHash=BCrypt.Net.BCrypt.HashPassword("cash123"),    Role="Cashier",  DisplayName="Kassir Dilnoza" },
        ]);
    }

    private static void SeedReservations(AppDbContext db)
    {
        db.Reservations.AddRange([
            new Reservation { Id="RES-001", GuestName="Aliyev A.",   Phone="+998901234567", TableNumber=3,  Guests=4, Time=DateTime.UtcNow.AddHours(1),  Status="Pending",   Note="" },
            new Reservation { Id="RES-002", GuestName="Karimov B.",  Phone="+998907654321", TableNumber=5,  Guests=2, Time=DateTime.UtcNow.AddHours(2),  Status="Pending",   Note="Vegetarian menyu" },
            new Reservation { Id="RES-003", GuestName="Rahimov D.",  Phone="+998905555555", TableNumber=8,  Guests=6, Time=DateTime.UtcNow.AddHours(3),  Status="Confirmed", Note="Tug'ilgan kun" },
            new Reservation { Id="RES-004", GuestName="Toshmatov E.",Phone="+998903333333", TableNumber=12, Guests=2, Time=DateTime.UtcNow.AddHours(4),  Status="Pending",   Note="" },
        ]);
    }

    private static void SeedHistory()
    {
        OrderHistoryLog.Instance.SeedBulk([
            new HistoryEntry { Id="ORD-040", TableNumber=5, Waiter="Malika", Total=97000,
                Status="Closed", Timestamp=DateTime.UtcNow.AddHours(-2),
                PaymentMethod="Karta", Items=["Smash Burger x2","Limonad x1"], Discount=0, Tip=5000 },
            new HistoryEntry { Id="ORD-041", TableNumber=8, Waiter="Sardor", Total=45000,
                Status="Cancelled", Timestamp=DateTime.UtcNow.AddHours(-1),
                PaymentMethod=null,  Items=["Margherita Pizza x1"], Discount=0, Tip=0 },
        ]);
    }

    // Composite pattern: combo meals are read-only static data — no DB needed
    public static IReadOnlyList<IMenuComponent> BuildCombos()
    {
        var lunch = new ComboMealGroup("combo-1", "Biznes Lunch", 0.10m);
        lunch.Add(new SingleMenuItem("m1", "Caesar Salat",   28000, "Starter"));
        lunch.Add(new SingleMenuItem("m2", "Smash Burger",   42000, "Main"));
        lunch.Add(new SingleMenuItem("m7", "Limonad",        15000, "Beverage"));

        var dinner = new ComboMealGroup("combo-2", "Oilaviy Kechki Ovqat", 0.12m);
        dinner.Add(new SingleMenuItem("m3", "Margherita Pizza", 45000, "Main"));
        dinner.Add(new SingleMenuItem("m5", "Cheesecake",        22000, "Dessert"));
        dinner.Add(new SingleMenuItem("m8", "Kofe Americano",    12000, "Beverage"));

        var salmon = new ComboMealGroup("combo-3", "Baliqchi Seti", 0.10m);
        salmon.Add(new SingleMenuItem("m4", "Grilled Salmon",    65000, "Main"));
        salmon.Add(new SingleMenuItem("m6", "Tiramisu",          25000, "Dessert"));
        salmon.Add(new SingleMenuItem("m9", "Fresh Orange Juice",18000, "Beverage"));

        return [lunch, dinner, salmon];
    }
}
