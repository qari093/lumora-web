import type { PhantomCircleMember } from "./phantomCircleModel";

export function canFormPhantomCircle(members: PhantomCircleMember[]): boolean {
  return members.length >= 4 && members.length <= 6;
}

export function groupNewcomers(members: PhantomCircleMember[]): PhantomCircleMember[][] {
  const groups: PhantomCircleMember[][] = [];

  for (let i = 0; i < members.length; i += 6) {
    const group = members.slice(i, i + 6);
    if (group.length >= 4) groups.push(group);
  }

  return groups;
}
