export type ControllerState = {
  up: boolean;
  down: boolean;
  left: boolean;
  right: boolean;
};

export const DEFAULT_CONTROLLER: ControllerState = {
  up: false,
  down: false,
  left: false,
  right: false
};
