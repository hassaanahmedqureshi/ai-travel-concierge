export default function Header() {
  return (
    <header className="flex-shrink-0 flex items-center gap-3 border-b border-zinc-200 dark:border-zinc-800 px-6 py-3 bg-white dark:bg-zinc-950">
      <span className="text-2xl">✈️</span>
      <div>
        <h1 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50 leading-tight">
          AI Travel Concierge
        </h1>
        <p className="text-xs text-zinc-400">Describe your trip, get a personalized itinerary</p>
      </div>
    </header>
  );
}
