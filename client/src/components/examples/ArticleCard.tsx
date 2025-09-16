import ArticleCard from '../ArticleCard';
import type { Article } from '@shared/schema';

const mockArticle: Article = {
  id: "1",
  title: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
  content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  excerpt: "Lorem ipsum dolor sit amet, consectetur adipiscing",
  category: "Politics",
  author: "John Smith",
  publishedAt: new Date('2024-01-15'),
  imageUrl: "/api/placeholder/400/225",
  slug: "lorem-ipsum-dolor-sit-amet",
  createdAt: new Date('2024-01-15'),
  updatedAt: new Date('2024-01-15'),
};

export default function ArticleCardExample() {
  return (
    <div className="max-w-sm">
      <ArticleCard article={mockArticle} />
    </div>
  );
}