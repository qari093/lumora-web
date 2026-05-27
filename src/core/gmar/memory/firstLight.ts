export type FirstLightEcho = {
  id: "first-light";
  title: "First Light";
  private: true;
  permanent: true;
  source: "first_echo_rite";
};

export function createFirstLightEcho(): FirstLightEcho {
  return {
    id: "first-light",
    title: "First Light",
    private: true,
    permanent: true,
    source: "first_echo_rite",
  };
}
