import { Link, useLocation } from "wouter";
import { Card } from "@/components/ui/card";
import type { Category } from "@shared/news-schema";

const categories: Category[] = ["Politics", "Sports", "Tech", "Entertainment"];

export default function CategorySidebar() {
  const [location] = useLocation();

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold text-card-foreground mb-4">Categories</h2>
      <nav className="space-y-2">
        {categories.map((category) => {
          const href = `/category/${category.toLowerCase()}`;
          const isActive = location === href;
          
          return (
            <Link
              key={category}
              href={`/category/${category.toLowerCase()}`}
              onClick={() => window.scrollTo(0, 0)}
              className={`block py-3 px-4 rounded-lg transition-all ${
                location === `/category/${category.toLowerCase()}`
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted"
              }`}
              data-testid={`link-sidebar-${category.toLowerCase()}`}
            >
              {category}
            </Link>
          );
        })}
      </nav>
    </Card>
  );
}