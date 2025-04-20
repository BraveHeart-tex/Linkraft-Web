'use client';
import { useTrashedBookmarks } from '../bookmark.api';
import BookmarkCard from '../BookmarkCard';

const TrashedBookmarkList = () => {
  const { data: trashedBookmarks } = useTrashedBookmarks();
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 3xl:grid-cols-4">
      {trashedBookmarks?.map((bookmark) => (
        <BookmarkCard key={bookmark.id} bookmark={bookmark} />
      ))}
    </div>
  );
};

export default TrashedBookmarkList;
