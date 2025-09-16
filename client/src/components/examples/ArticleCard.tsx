import ArticleCard from '../ArticleCard';
import { mockArticles } from '@shared/news-schema';

export default function ArticleCardExample() {
  return (
    <div className="max-w-sm">
      <ArticleCard article={mockArticles[0]} />
    </div>
  );
}