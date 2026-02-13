interface CategoryFilterProps {
  categories: string[];
  activeCategory: string | null;
  onSelect: (category: string | null) => void;
}

const CategoryFilter = ({ categories, activeCategory, onSelect }: CategoryFilterProps) => {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide px-1">
      <button
        onClick={() => onSelect(null)}
        className={`px-5 py-2 rounded-full font-body text-sm font-semibold transition-all duration-200 ${
          activeCategory === null
            ? "bg-primary text-primary-foreground shadow-md"
            : "bg-muted text-muted-foreground hover:bg-primary/10"
        }`}
      >
        All
      </button>
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onSelect(cat)}
          className={`px-5 py-2 rounded-full font-body text-sm font-semibold transition-all duration-200 ${
            activeCategory === cat
              ? "bg-primary text-primary-foreground shadow-md"
              : "bg-muted text-muted-foreground hover:bg-primary/10"
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;
