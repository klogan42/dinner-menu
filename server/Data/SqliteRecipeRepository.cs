using Microsoft.EntityFrameworkCore;
using OurTable.Models;

namespace OurTable.Data;

public class SqliteRecipeRepository : IRecipeRepository
{
    private readonly AppDbContext _db;

    public SqliteRecipeRepository(AppDbContext db) => _db = db;

    public async Task<List<Recipe>> GetAllAsync() =>
        await _db.Recipes.Include(r => r.Ingredients).ToListAsync();

    public async Task<Recipe?> GetByIdAsync(Guid id) =>
        await _db.Recipes.Include(r => r.Ingredients).FirstOrDefaultAsync(r => r.Id == id);

    public async Task<Recipe> CreateAsync(Recipe recipe)
    {
        recipe.Id = Guid.NewGuid();
        recipe.CreatedAt = DateTime.UtcNow;
        _db.Recipes.Add(recipe);
        await _db.SaveChangesAsync();
        return recipe;
    }

    public async Task<Recipe?> UpdateAsync(Guid id, Recipe updated)
    {
        var existing = await _db.Recipes.Include(r => r.Ingredients).FirstOrDefaultAsync(r => r.Id == id);
        if (existing is null) return null;

        existing.Title = updated.Title;
        existing.Description = updated.Description;
        existing.Tags = updated.Tags;
        existing.Steps = updated.Steps;
        existing.PrepTimeMinutes = updated.PrepTimeMinutes;
        existing.CookTimeMinutes = updated.CookTimeMinutes;
        existing.Servings = updated.Servings;
        existing.IsFavorite = updated.IsFavorite;

        // Replace ingredients
        existing.Ingredients.Clear();
        existing.Ingredients.AddRange(updated.Ingredients);

        await _db.SaveChangesAsync();
        return existing;
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        var recipe = await _db.Recipes.FindAsync(id);
        if (recipe is null) return false;
        _db.Recipes.Remove(recipe);
        await _db.SaveChangesAsync();
        return true;
    }

    public async Task<Recipe?> ToggleFavoriteAsync(Guid id)
    {
        var recipe = await _db.Recipes.Include(r => r.Ingredients).FirstOrDefaultAsync(r => r.Id == id);
        if (recipe is null) return null;
        recipe.IsFavorite = !recipe.IsFavorite;
        await _db.SaveChangesAsync();
        return recipe;
    }

    public async Task<List<Recipe>> GetRandomAsync(int count)
    {
        var all = await _db.Recipes.Include(r => r.Ingredients).ToListAsync();
        return all.OrderBy(_ => Random.Shared.Next()).Take(count).ToList();
    }
}
