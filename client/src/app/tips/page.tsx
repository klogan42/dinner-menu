export default function TipsPage() {
  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-display text-amber-900 mb-6">Tips</h1>
      <div className="space-y-8 text-sm font-display text-amber-800">
        <div>
          <h2 className="text-lg text-amber-900 mb-3 border-b border-amber-300 pb-2">Planner</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-base text-amber-900 mb-1">Randomize Your Week</h3>
              <p>Hit the Randomize button on the planner to fill the week with random picks from your recipe library. You can also randomize individual days with the dice icon on each card.</p>
            </div>
            <div>
              <h3 className="text-base text-amber-900 mb-1">Shopping List</h3>
              <p>Once your week is planned, tap Shopping List to generate a combined grocery list from all the recipes. Copy it to your clipboard or print it.</p>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-lg text-amber-900 mb-3 border-b border-amber-300 pb-2">Recipes</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-base text-amber-900 mb-1">Tags</h3>
              <p>Tag recipes with categories like quick, crockpot, grill, pasta, or soup. Filter by tag on the Recipes page to narrow down your options.</p>
            </div>
            <div>
              <h3 className="text-base text-amber-900 mb-1">Favorites</h3>
              <p>Star your favorite recipes. Use the &ldquo;Favorites Only&rdquo; filter to quickly find your go-to meals.</p>
            </div>
            <div>
              <h3 className="text-base text-amber-900 mb-1">Overdue a Cook</h3>
              <p>Toggle &ldquo;Overdue a Cook&rdquo; to filter recipes you haven&rsquo;t made in 30 or more days. Great for rediscovering meals you forgot about.</p>
            </div>
            <div>
              <h3 className="text-base text-amber-900 mb-1">Meal History</h3>
              <p>Each recipe card shows the last few times you cooked it. Tap into a recipe to see the full cooking history.</p>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-lg text-amber-900 mb-3 border-b border-amber-300 pb-2">Spots</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-base text-amber-900 mb-1">Eating Out</h3>
              <p>Assign the &ldquo;Eat Out&rdquo; recipe to a day on the planner. You&rsquo;ll be prompted to pick a restaurant from your Spots list. Add restaurants on the Spots page and they&rsquo;ll show up whenever you plan to eat out.</p>
            </div>
            <div>
              <h3 className="text-base text-amber-900 mb-1">Favorites</h3>
              <p>Star your favorite spots. Use the &ldquo;Favorites Only&rdquo; filter to quickly find your go-to restaurants.</p>
            </div>
            <div>
              <h3 className="text-base text-amber-900 mb-1">Visit History</h3>
              <p>Each restaurant card tracks when you last visited and how many times you&rsquo;ve been. Use &ldquo;Overdue a Visit&rdquo; to find places you haven&rsquo;t been to in a while.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
