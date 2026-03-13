namespace OurTable.Models;

public class WeekPlanEntry
{
    public int Id { get; set; }
    public string Day { get; set; } = "";
    public Guid? RecipeId { get; set; }
}

public class MealHistoryEntry
{
    public int Id { get; set; }
    public DateOnly Date { get; set; }
    public Guid RecipeId { get; set; }
}
