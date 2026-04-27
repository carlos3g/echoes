import React from 'react';
import { useTranslation } from 'react-i18next';
import { useFollowUser } from '@/features/user/hooks/use-follow-user';
import { useUnfollowUser } from '@/features/user/hooks/use-unfollow-user';
import { Button } from '@/shared/components/ui/button';

interface FollowButtonProps {
  username: string;
  isFollowing: boolean;
}

export const FollowButton: React.FC<FollowButtonProps> = ({ username, isFollowing }) => {
  const { t } = useTranslation();
  const followMutation = useFollowUser(username);
  const unfollowMutation = useUnfollowUser(username);

  const isLoading = followMutation.isPending || unfollowMutation.isPending;

  const handlePress = () => {
    if (isFollowing) {
      unfollowMutation.mutate();
    } else {
      followMutation.mutate();
    }
  };

  return (
    <Button
      variant={isFollowing ? 'outline' : 'primary'}
      title={isFollowing ? t('user.unfollow') : t('user.follow')}
      loading={isLoading}
      onPress={handlePress}
    />
  );
};
