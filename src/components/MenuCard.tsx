import { MenuItem } from "@/lib/menu-data";

interface MenuCardProps {
  item: MenuItem;
}

const MenuCard = ({ item }: MenuCardProps) => {
  return (
    <div className="group bg-card/80 backdrop-blur-sm rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 animate-fade-in flex flex-row items-stretch">
      <div className="flex-1 p-4 flex flex-col justify-center min-w-0">
        <h3 className="font-heading text-base font-bold text-card-foreground mb-1 truncate">{item.name}</h3>
        {item.description && (
          <p className="text-sm text-muted-foreground leading-snug line-clamp-2 mb-2">{item.description}</p>
        )}
        <span className="font-heading text-base font-bold text-gold">
          ${item.price.toFixed(2)}
        </span>
      </div>
      {item.image_url && (
        <div className="w-28 h-28 m-3 rounded-lg overflow-hidden flex-shrink-0 bg-muted">
          <img
            src={item.image_url}
            alt={item.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
      )}
    </div>
  );
};

export default MenuCard;
