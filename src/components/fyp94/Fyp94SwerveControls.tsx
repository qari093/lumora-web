export function Fyp94SwerveControls({
  onMore,
  onDifferent,
  onSwitch,
}: {
  onMore?: () => void;
  onDifferent?: () => void;
  onSwitch?: () => void;
}) {
  return (
    <div data-testid="swerve-controls">
      <button onClick={onMore}>⚡ More</button>
      <button onClick={onDifferent}>💤 Different</button>
      <button onClick={onSwitch}>🔄 Switch</button>
    </div>
  );
}
