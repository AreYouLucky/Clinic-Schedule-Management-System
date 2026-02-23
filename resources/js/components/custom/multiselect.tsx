import * as React from "react";
import * as Popover from "@radix-ui/react-popover";
import * as Checkbox from "@radix-ui/react-checkbox";

type OptionId = string | number;

export type MultiSelectProps<T> = {
  options: T[];
  selectedIds: OptionId[];
  onChange: (selectedIds: OptionId[]) => void;
  getOptionValue: (option: T) => OptionId;
  getOptionLabel: (option: T) => string;
  placeholder?: string;
  className?: string;
};

export function MultiSelect<T>({
  options,
  selectedIds,
  onChange,
  getOptionValue,
  getOptionLabel,
  placeholder = "Select...",
  className = "",
}: MultiSelectProps<T>) {
  const [open, setOpen] = React.useState(false);

  const toggleOption = React.useCallback(
    (id: OptionId) => {
      if (selectedIds.includes(id)) {
        onChange(selectedIds.filter((selectedId) => selectedId !== id));
      } else {
        onChange([...selectedIds, id]);
      }
    },
    [onChange, selectedIds]
  );

  const removePill = (id: OptionId) => {
    onChange(selectedIds.filter((selectedId) => selectedId !== id));
  };

  const selectedOptions = options.filter((option) =>
    selectedIds.includes(getOptionValue(option))
  );

  const renderPills = () => {
    if (selectedOptions.length === 0) {
      return (
        <span className="text-gray-400 text-sm truncate">{placeholder}</span>
      );
    }

    const maxVisible = 2;
    const visible = selectedOptions.slice(0, maxVisible);
    const remainingCount = selectedOptions.length - visible.length;

    return (
      <div className="flex flex-wrap gap-1">
        {visible.map((option) => {
          const id = getOptionValue(option);
          const label = getOptionLabel(option);
          return (
            <span
              key={id}
              className="flex items-center gap-1 rounded-full bg-gray-200 text-gray-600 text-xs px-2 py-0.5"
            >
              <span className="truncate max-w-24 text-[11px]">{label}</span>
              <span
                role="button"
                tabIndex={0}
                onClick={(e) => {
                  e.stopPropagation();
                  removePill(id);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    removePill(id);
                  }
                }}
                className="cursor-pointer text-[7px] leading-none hover:text-red-200 text-gray-900"
              >
                ✕
              </span>
            </span>
          );
        })}
        {remainingCount > 0 && (
          <span className="text-xs text-gray-500">
            +{remainingCount} more
          </span>
        )}
      </div>
    );
  };

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <button
          type="button"
          className={`flex h-11 shadow-sm w-full items-center justify-between rounded-lg border border-gray-300 bg-white px-3 py-2 text-left text-sm focus:outline-none ${className}`}
        >
          <div className="flex-1 flex flex-wrap gap-1 overflow-hidden">
            {renderPills()}
          </div>
          <span className="ml-2 text-xs text-gray-500"></span>
        </button>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          side="bottom"
          align="start"
          className="mt-1 w-var(--radix-popover-trigger-width) rounded-md border border-gray-200 bg-white shadow-md py-2 z-50"
        >
          <div className="max-h-60 overflow-auto text-sm scroll-slim">
            {options.length === 0 && (
              <div className="px-1 py-1 text-gray-400 text-xs">
                No options.
              </div>
            )}

            {options.map((option) => {
              const id = getOptionValue(option);
              const label = getOptionLabel(option);
              const isChecked = selectedIds.includes(id);

              return (
                <label
                  key={id}
                  className="flex cursor-pointer items-center gap-2 rounded-sm px-1 py-1 hover:bg-gray-100"
                >
                  <Checkbox.Root
                    checked={isChecked}
                    onCheckedChange={() => toggleOption(id)}
                    className="flex h-4 w-4 items-center justify-center rounded-full border border-gray-400 data-[state=checked]:bg-gray-700"
                  >
                    <Checkbox.Indicator className="text-white text-xs">
                      ✓
                    </Checkbox.Indicator>
                  </Checkbox.Root>
                  <span className="truncate text-[12px]">{label}</span>
                </label>
              );
            })}
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
