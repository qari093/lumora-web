import { getPortalCards } from "@/lib/portal/getPortalCards";
import { getPortalHealthMatrix } from "@/lib/portal/getPortalHealthMatrix";

export function getPortalOverview() {
  const cards = getPortalCards();
  const health = getPortalHealthMatrix();

  const overview = cards.map((card) => {
    const healthItem = health.find((item) => item.key === card.key);

    return {
      key: card.key,
      title: card.title,
      subtitle: card.subtitle,
      path: card.path,
      enabled: card.enabled,
      status: card.status,
      routeReady: healthItem?.routeReady ?? false,
      apiReady: healthItem?.apiReady ?? false,
      uiReady: healthItem?.uiReady ?? false,
      healthy: healthItem?.status === "healthy",
    };
  });

  return {
    total: overview.length,
    active: overview.filter((item) => item.enabled).length,
    healthy: overview.filter((item) => item.healthy).length,
    items: overview,
  };
}
