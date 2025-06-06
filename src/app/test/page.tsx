import SimpleTreeView from '@/components/SimpleTreeview';
import { getCollections } from '@/features/collections/collection.server';

const TestPage = async () => {
  const collections = await getCollections();

  return <SimpleTreeView collections={collections} />;
};

export default TestPage;
