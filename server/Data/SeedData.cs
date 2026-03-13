using OurTable.Models;

namespace OurTable.Data;

public static class SeedData
{
    public static List<Recipe> GetRecipes() =>
    [
        new Recipe
        {
            Title = "Spaghetti and Meatballs",
            Description = "Classic spaghetti with homemade meatballs in marinara sauce.",
            Tags = ["pasta", "quick"],
            Ingredients =
            [
                new() { Name = "Spaghetti", Amount = "1", Unit = "lb" },
                new() { Name = "Ground beef", Amount = "1", Unit = "lb" },
                new() { Name = "Breadcrumbs", Amount = "1/2", Unit = "cup" },
                new() { Name = "Egg", Amount = "1", Unit = "" },
                new() { Name = "Marinara sauce", Amount = "24", Unit = "oz" },
                new() { Name = "Parmesan cheese", Amount = "1/4", Unit = "cup" },
                new() { Name = "Garlic", Amount = "2", Unit = "cloves" },
                new() { Name = "Olive oil", Amount = "2", Unit = "tbsp" }
            ],
            Steps =
            [
                "Mix ground beef, breadcrumbs, egg, and garlic in a bowl.",
                "Form into 1-inch meatballs.",
                "Heat olive oil in a skillet and brown meatballs on all sides.",
                "Add marinara sauce, cover, and simmer for 20 minutes.",
                "Cook spaghetti according to package directions.",
                "Serve meatballs and sauce over spaghetti, topped with Parmesan."
            ],
            PrepTimeMinutes = 15,
            CookTimeMinutes = 30,
            Servings = 6,
            IsFavorite = true
        },
        new Recipe
        {
            Title = "Taco Night",
            Description = "Seasoned ground beef tacos with all the fixings.",
            Tags = ["quick"],
            Ingredients =
            [
                new() { Name = "Ground beef", Amount = "1", Unit = "lb" },
                new() { Name = "Taco seasoning", Amount = "1", Unit = "packet" },
                new() { Name = "Taco shells", Amount = "12", Unit = "" },
                new() { Name = "Shredded cheese", Amount = "1", Unit = "cup" },
                new() { Name = "Lettuce", Amount = "2", Unit = "cups" },
                new() { Name = "Tomato", Amount = "2", Unit = "" },
                new() { Name = "Sour cream", Amount = "1/2", Unit = "cup" },
                new() { Name = "Salsa", Amount = "1/2", Unit = "cup" }
            ],
            Steps =
            [
                "Brown ground beef in a skillet and drain fat.",
                "Add taco seasoning and water per packet directions. Simmer 5 minutes.",
                "Warm taco shells in the oven.",
                "Dice tomatoes and shred lettuce.",
                "Set up a taco bar with all toppings and let everyone build their own!"
            ],
            PrepTimeMinutes = 10,
            CookTimeMinutes = 15,
            Servings = 6,
            IsFavorite = false
        },
        new Recipe
        {
            Title = "Homemade Pizza",
            Description = "Fun family pizza night with customizable toppings.",
            Tags = ["quick"],
            Ingredients =
            [
                new() { Name = "Pizza dough", Amount = "1", Unit = "lb" },
                new() { Name = "Pizza sauce", Amount = "1/2", Unit = "cup" },
                new() { Name = "Mozzarella cheese", Amount = "2", Unit = "cups" },
                new() { Name = "Pepperoni", Amount = "1/2", Unit = "cup" },
                new() { Name = "Bell pepper", Amount = "1", Unit = "" },
                new() { Name = "Olive oil", Amount = "1", Unit = "tbsp" }
            ],
            Steps =
            [
                "Preheat oven to 450F.",
                "Stretch dough on a floured surface into a circle.",
                "Place on a greased baking sheet or pizza stone.",
                "Spread sauce evenly, leaving a border for the crust.",
                "Add cheese and desired toppings.",
                "Bake for 12-15 minutes until crust is golden and cheese is bubbly."
            ],
            PrepTimeMinutes = 15,
            CookTimeMinutes = 15,
            Servings = 4,
            IsFavorite = true
        },
        new Recipe
        {
            Title = "Mac and Cheese with Hot Dogs",
            Description = "Creamy homemade mac and cheese with sliced hot dogs mixed in.",
            Tags = ["pasta", "quick"],
            Ingredients =
            [
                new() { Name = "Elbow macaroni", Amount = "1", Unit = "lb" },
                new() { Name = "Butter", Amount = "3", Unit = "tbsp" },
                new() { Name = "All-purpose flour", Amount = "3", Unit = "tbsp" },
                new() { Name = "Milk", Amount = "2.5", Unit = "cups" },
                new() { Name = "Cheddar cheese", Amount = "3", Unit = "cups" },
                new() { Name = "Hot dogs", Amount = "4", Unit = "" },
                new() { Name = "Salt", Amount = "1", Unit = "tsp" },
                new() { Name = "Mustard powder", Amount = "1/2", Unit = "tsp" }
            ],
            Steps =
            [
                "Cook macaroni according to package directions. Drain.",
                "Slice hot dogs into coins and brown in a skillet.",
                "Melt butter in a saucepan, whisk in flour, cook 1 minute.",
                "Gradually add milk, whisking constantly until thickened.",
                "Remove from heat and stir in cheese until melted.",
                "Combine pasta, cheese sauce, and hot dogs. Serve warm."
            ],
            PrepTimeMinutes = 10,
            CookTimeMinutes = 20,
            Servings = 6,
            IsFavorite = false
        },
        new Recipe
        {
            Title = "Slow Cooker Chicken Noodle Soup",
            Description = "Comforting chicken noodle soup that cooks itself in the crockpot.",
            Tags = ["soup", "crockpot"],
            Ingredients =
            [
                new() { Name = "Chicken breasts", Amount = "2", Unit = "lbs" },
                new() { Name = "Chicken broth", Amount = "8", Unit = "cups" },
                new() { Name = "Carrots", Amount = "3", Unit = "" },
                new() { Name = "Celery stalks", Amount = "3", Unit = "" },
                new() { Name = "Onion", Amount = "1", Unit = "" },
                new() { Name = "Egg noodles", Amount = "2", Unit = "cups" },
                new() { Name = "Garlic", Amount = "3", Unit = "cloves" },
                new() { Name = "Bay leaves", Amount = "2", Unit = "" },
                new() { Name = "Salt", Amount = "1", Unit = "tsp" },
                new() { Name = "Pepper", Amount = "1/2", Unit = "tsp" }
            ],
            Steps =
            [
                "Dice carrots, celery, and onion.",
                "Place chicken, vegetables, garlic, bay leaves, salt, and pepper in slow cooker.",
                "Pour broth over everything.",
                "Cook on low for 6-8 hours or high for 3-4 hours.",
                "Remove chicken, shred with two forks, and return to pot.",
                "Add egg noodles and cook on high for 20 more minutes.",
                "Remove bay leaves and serve."
            ],
            PrepTimeMinutes = 15,
            CookTimeMinutes = 360,
            Servings = 8,
            IsFavorite = true
        },
        new Recipe
        {
            Title = "Grilled Chicken with Buttered Rice",
            Description = "Simple grilled chicken thighs served over fluffy buttered rice.",
            Tags = ["grill", "quick"],
            Ingredients =
            [
                new() { Name = "Chicken thighs", Amount = "2", Unit = "lbs" },
                new() { Name = "Olive oil", Amount = "2", Unit = "tbsp" },
                new() { Name = "Garlic powder", Amount = "1", Unit = "tsp" },
                new() { Name = "Paprika", Amount = "1", Unit = "tsp" },
                new() { Name = "Salt", Amount = "1", Unit = "tsp" },
                new() { Name = "Long grain rice", Amount = "2", Unit = "cups" },
                new() { Name = "Butter", Amount = "3", Unit = "tbsp" },
                new() { Name = "Chicken broth", Amount = "4", Unit = "cups" }
            ],
            Steps =
            [
                "Season chicken with olive oil, garlic powder, paprika, and salt.",
                "Let marinate 15 minutes (or longer if you have time).",
                "Bring chicken broth to a boil, add rice, cover, and simmer 18 minutes.",
                "Preheat grill to medium-high heat.",
                "Grill chicken 6-7 minutes per side until internal temp reaches 165F.",
                "Fluff rice with a fork and stir in butter.",
                "Serve chicken over buttered rice."
            ],
            PrepTimeMinutes = 20,
            CookTimeMinutes = 25,
            Servings = 6,
            IsFavorite = false
        }
    ];
}
