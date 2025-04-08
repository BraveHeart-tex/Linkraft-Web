import { generateAvatarFallback } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface UserAvatarProps {
  profilePicture: string | undefined;
  visibleName: string | undefined;
}

const UserAvatar = ({ profilePicture, visibleName }: UserAvatarProps) => {
  return (
    <Avatar>
      <AvatarImage src={profilePicture} />
      <AvatarFallback>
        {generateAvatarFallback(visibleName || '')}
      </AvatarFallback>
    </Avatar>
  );
};

export default UserAvatar;
