using System.ComponentModel.DataAnnotations;

namespace OurTable.Models;

public class Ingredient
{
    public string Name { get; set; } = "";
    public string Amount { get; set; } = "";
    public string Unit { get; set; } = "";
}

public class Recipe
{
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    public string Title { get; set; } = "";
    public string Description { get; set; } = "";
    public List<string> Tags { get; set; } = [];
    public List<Ingredient> Ingredients { get; set; } = [];
    public List<string> Steps { get; set; } = [];
    public int PrepTimeMinutes { get; set; }
    public int CookTimeMinutes { get; set; }
    public int Servings { get; set; }
    public bool IsFavorite { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
