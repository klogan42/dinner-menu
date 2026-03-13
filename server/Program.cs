using Microsoft.EntityFrameworkCore;
using OurTable.Data;
using OurTable.Models;

var builder = WebApplication.CreateBuilder(args);

// Database — swap to MongoDB by replacing SqliteRecipeRepository
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite("Data Source=ourtable.db"));
builder.Services.AddScoped<IRecipeRepository, SqliteRecipeRepository>();

builder.Services.AddOpenApi();
var allowedOrigins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>()
    ?? new[] { "http://localhost:3000" };
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.WithOrigins(allowedOrigins)
              .WithMethods("GET", "POST", "PUT", "DELETE", "PATCH")
              .WithHeaders("Content-Type", "Authorization");
    });
});

var app = builder.Build();

// Create database and seed if empty
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.EnsureCreated();
    if (!db.Recipes.Any())
    {
        db.Recipes.AddRange(SeedData.GetRecipes());
        db.SaveChanges();
    }
}

app.UseCors();
app.MapOpenApi();

// ── Recipe Endpoints ──

app.MapGet("/api/recipes", async (IRecipeRepository repo) =>
    Results.Ok(await repo.GetAllAsync()));

app.MapGet("/api/recipes/random", async (IRecipeRepository repo) =>
    Results.Ok(await repo.GetRandomAsync(7)));

app.MapGet("/api/recipes/{id:guid}", async (Guid id, IRecipeRepository repo) =>
    await repo.GetByIdAsync(id) is Recipe r ? Results.Ok(r) : Results.NotFound());

app.MapPost("/api/recipes", async (Recipe recipe, IRecipeRepository repo) =>
{
    var created = await repo.CreateAsync(recipe);
    return Results.Created($"/api/recipes/{created.Id}", created);
});

app.MapPut("/api/recipes/{id:guid}", async (Guid id, Recipe recipe, IRecipeRepository repo) =>
    await repo.UpdateAsync(id, recipe) is Recipe r ? Results.Ok(r) : Results.NotFound());

app.MapDelete("/api/recipes/{id:guid}", async (Guid id, IRecipeRepository repo) =>
    await repo.DeleteAsync(id) ? Results.NoContent() : Results.NotFound());

app.MapPatch("/api/recipes/{id:guid}/favorite", async (Guid id, IRecipeRepository repo) =>
    await repo.ToggleFavoriteAsync(id) is Recipe r ? Results.Ok(r) : Results.NotFound());

// ── Week Plan Endpoints ──

app.MapGet("/api/weekplan", async (AppDbContext db) =>
{
    var entries = await db.WeekPlan.ToListAsync();
    var plan = new Dictionary<string, Guid?>();
    foreach (var e in entries) plan[e.Day] = e.RecipeId;
    return Results.Ok(plan);
});

app.MapPut("/api/weekplan", async (Dictionary<string, Guid?> plan, AppDbContext db) =>
{
    var existing = await db.WeekPlan.ToListAsync();
    db.WeekPlan.RemoveRange(existing);
    foreach (var (day, recipeId) in plan)
    {
        db.WeekPlan.Add(new WeekPlanEntry { Day = day, RecipeId = recipeId });
    }

    // Also save to meal history with actual dates
    var dayNames = new[] { "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday" };
    var today = DateOnly.FromDateTime(DateTime.Now);
    var todayDow = (int)DateTime.Now.DayOfWeek;
    foreach (var (day, recipeId) in plan)
    {
        if (recipeId == null) continue;
        var dayIndex = Array.IndexOf(dayNames, day);
        if (dayIndex < 0) continue;
        var offset = (dayIndex - todayDow + 7) % 7;
        var date = today.AddDays(offset);

        var existingEntry = await db.MealHistory.FirstOrDefaultAsync(e => e.Date == date);
        if (existingEntry != null)
        {
            existingEntry.RecipeId = recipeId.Value;
        }
        else
        {
            db.MealHistory.Add(new MealHistoryEntry { Date = date, RecipeId = recipeId.Value });
        }
    }

    await db.SaveChangesAsync();
    return Results.Ok(plan);
});

app.MapDelete("/api/weekplan", async (AppDbContext db) =>
{
    var existing = await db.WeekPlan.ToListAsync();
    db.WeekPlan.RemoveRange(existing);
    await db.SaveChangesAsync();
    return Results.NoContent();
});

// ── Meal History Endpoints ──

app.MapPut("/api/mealhistory/{date}", async (string date, MealHistoryUpdate body, AppDbContext db) =>
{
    var d = DateOnly.Parse(date);
    var existing = await db.MealHistory.FirstOrDefaultAsync(e => e.Date == d);

    if (body.RecipeId == null)
    {
        if (existing != null) db.MealHistory.Remove(existing);
    }
    else
    {
        if (existing != null)
            existing.RecipeId = body.RecipeId.Value;
        else
            db.MealHistory.Add(new MealHistoryEntry { Date = d, RecipeId = body.RecipeId.Value });
    }

    await db.SaveChangesAsync();
    return Results.NoContent();
});

app.MapGet("/api/mealhistory", async (int year, int month, AppDbContext db) =>
{
    var from = new DateOnly(year, month, 1);
    var to = from.AddMonths(1).AddDays(-1);
    var entries = await db.MealHistory
        .Where(e => e.Date >= from && e.Date <= to)
        .ToListAsync();
    var result = entries.ToDictionary(e => e.Date.ToString("yyyy-MM-dd"), e => e.RecipeId);
    return Results.Ok(result);
});

app.Run();

public record MealHistoryUpdate(Guid? RecipeId);
