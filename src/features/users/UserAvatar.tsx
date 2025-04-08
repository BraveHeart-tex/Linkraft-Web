import { generateAvatarFallback } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface UserAvatarProps {
  profilePicture: string | undefined;
  visibleName: string | undefined;
  avatarClassNames?: string;
}

const UserAvatar = ({
  profilePicture,
  visibleName,
  avatarClassNames,
}: UserAvatarProps) => {
  return (
    <Avatar className={avatarClassNames}>
      <AvatarImage src={profilePicture} />
      <AvatarFallback>
        {generateAvatarFallback(visibleName || '')}
      </AvatarFallback>
    </Avatar>
  );
};

export default UserAvatar;
