using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using OurTable.Models;

namespace OurTable.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Recipe> Recipes => Set<Recipe>();
    public DbSet<WeekPlanEntry> WeekPlan => Set<WeekPlanEntry>();
    public DbSet<MealHistoryEntry> MealHistory => Set<MealHistoryEntry>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Recipe>(entity =>
        {
            entity.HasKey(r => r.Id);

            entity.OwnsMany(r => r.Ingredients, ing =>
            {
                ing.WithOwner().HasForeignKey("RecipeId");
                ing.Property<int>("Id").ValueGeneratedOnAdd();
                ing.HasKey("Id");
            });

            var stringListComparer = new ValueComparer<List<string>>(
                (a, b) => a != null && b != null && a.SequenceEqual(b),
                c => c.Aggregate(0, (a, v) => HashCode.Combine(a, v.GetHashCode())),
                c => c.ToList()
            );

            entity.Property(r => r.Tags).HasConversion(
                v => string.Join("||", v),
                v => v.Split("||", StringSplitOptions.RemoveEmptyEntries).ToList()
            ).Metadata.SetValueComparer(stringListComparer);

            entity.Property(r => r.Steps).HasConversion(
                v => string.Join("||", v),
                v => v.Split("||", StringSplitOptions.RemoveEmptyEntries).ToList()
            ).Metadata.SetValueComparer(stringListComparer);
        });

        modelBuilder.Entity<WeekPlanEntry>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.Day).IsUnique();
        });

        modelBuilder.Entity<MealHistoryEntry>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.Date).IsUnique();
        });
    }
}
