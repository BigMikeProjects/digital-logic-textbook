import { loadAllTopics, getFirstTopicSlug } from '@/lib/content';
import ClientRedirect from './ClientRedirect';

export default async function HomePage() {
  const topics = await loadAllTopics();
  const firstSlug = getFirstTopicSlug(topics);

  if (firstSlug) {
    return <ClientRedirect to={`/${firstSlug}/`} />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Digital Logic Textbook
        </h1>
        <p className="text-gray-600">
          No content available. Please add topics to the content folder.
        </p>
      </div>
    </div>
  );
}
