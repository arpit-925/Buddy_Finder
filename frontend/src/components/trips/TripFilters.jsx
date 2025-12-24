const TripFilters = () => {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm space-y-4">
      <h3 className="font-semibold">Filters</h3>

      <input
        placeholder="Search destination"
        className="input w-full"
      />

      <div>
        <p className="text-sm font-medium mb-1">Vibe</p>
        <div className="space-y-2">
          <label><input type="radio" /> Adventure</label><br />
          <label><input type="radio" /> Relaxing</label><br />
          <label><input type="radio" /> Solo</label>
        </div>
      </div>

      <div>
        <p className="text-sm font-medium">Budget</p>
        <input type="range" min="1000" max="100000" />
      </div>
    </div>
  );
};

export default TripFilters;
