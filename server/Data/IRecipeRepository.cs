using OurTable.Models;

namespace OurTable.Data;

/// <summary>
/// Swap this implementation for MongoDB, Postgres, etc.
/// Just register a different class in Program.cs.
/// </summary>
public interface IRecipeRepository
{
    Task<List<Recipe>> GetAllAsync();
    Task<Recipe?> GetByIdAsync(Guid id);
    Task<Recipe> CreateAsync(Recipe recipe);
    Task<Recipe?> UpdateAsync(Guid id, Recipe recipe);
    Task<bool> DeleteAsync(Guid id);
    Task<Recipe?> ToggleFavoriteAsync(Guid id);
    Task<List<Recipe>> GetRandomAsync(int count);
}
