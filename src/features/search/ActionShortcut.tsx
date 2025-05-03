interface ActionShortcutProps {
  label: string;
  keys: string[];
}

const ActionShortcut = ({ label, keys }: ActionShortcutProps) => {
  return (
    <div className="flex items-center gap-1">
      <span className="text-xs">{label}</span>
      <div className="ml-2 flex gap-1">
        {keys.map((key, i) => (
          <div
            key={i}
            className="rounded bg-muted px-1.5 py-0.5 font-medium text-muted-foreground shadow-sm text-sm"
          >
            {key}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActionShortcut;
