export type FollowRelation = {
  followerId: string;
  followingId: string;
  createdAt: number;
};

export type FollowState = {
  relations: FollowRelation[];
};

export function follow(
  state: FollowState,
  followerId: string,
  followingId: string
): FollowState {
  if (!followerId || !followingId || followerId === followingId) return state;

  const exists = state.relations.some(
    (r) => r.followerId === followerId && r.followingId === followingId
  );
  if (exists) return state;

  return {
    relations: [
      ...state.relations,
      {
        followerId,
        followingId,
        createdAt: Date.now()
      }
    ]
  };
}

export function unfollow(
  state: FollowState,
  followerId: string,
  followingId: string
): FollowState {
  return {
    relations: state.relations.filter(
      (r) =>
        !(r.followerId === followerId && r.followingId === followingId)
    )
  };
}

export function getFollowers(state: FollowState, userId: string): string[] {
  return state.relations
    .filter((r) => r.followingId === userId)
    .map((r) => r.followerId);
}

export function getFollowing(state: FollowState, userId: string): string[] {
  return state.relations
    .filter((r) => r.followerId === userId)
    .map((r) => r.followingId);
}

export function isFollowing(
  state: FollowState,
  followerId: string,
  followingId: string
): boolean {
  return state.relations.some(
    (r) => r.followerId === followerId && r.followingId === followingId
  );
}
