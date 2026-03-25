"use client";

import { formatDistanceToNow } from "date-fns";
import { MessageSquareIcon, ClockIcon } from "lucide-react";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useConversations } from "../hooks/use-conversations";
import { Id } from "../../../../convex/_generated/dataModel";

interface PastConversationsDialogProps {
  projectId: Id<"projects">;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (conversationId: Id<"conversations">) => void;
}

export const PastConversationsDialog = ({
  projectId,
  open,
  onOpenChange,
  onSelect,
}: PastConversationsDialogProps) => {
  const conversations = useConversations(projectId);

  const handleSelect = (conversationId: Id<"conversations">) => {
    onSelect(conversationId);
    onOpenChange(false);
  };

  return (
    <CommandDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Past Conversations"
      description="Search and select a past conversation"
    >
      <CommandInput
        placeholder="Search conversations..."
        className="text-sm"
      />
      <CommandList className="max-h-[400px]">
        <CommandEmpty>
          <div className="flex flex-col items-center gap-2 py-8 text-muted-foreground">
            <MessageSquareIcon className="size-8 opacity-20" />
            <p className="text-sm">No conversations found</p>
          </div>
        </CommandEmpty>

        <CommandGroup
          heading={
            <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground/50">
              {conversations?.length ?? 0} Conversations
            </span>
          }
        >
          {conversations?.map((conversation, index) => (
            <CommandItem
              key={conversation._id}
              value={`${conversation.title}-${conversation._id}`}
              onSelect={() => handleSelect(conversation._id)}
              className="group flex items-start gap-3 px-3 py-2.5 rounded-lg cursor-pointer data-[selected=true]:bg-white/5"
            >
              {/* Index badge */}
              <div className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-md bg-primary/10 border border-primary/20 text-[10px] font-semibold text-primary/70 group-data-[selected=true]:bg-primary/20">
                {index + 1}
              </div>

              {/* Content */}
              <div className="flex flex-col gap-0.5 min-w-0 flex-1">
                <span className="text-sm font-medium text-foreground truncate leading-tight">
                  {conversation.title}
                </span>
                <div className="flex items-center gap-1 text-[11px] text-muted-foreground/50">
                  <ClockIcon className="size-2.5 shrink-0" />
                  <span>
                    {formatDistanceToNow(conversation._creationTime, {
                      addSuffix: true,
                    })}
                  </span>
                </div>
              </div>

              {/* Arrow hint on hover */}
              <span className="text-xs text-muted-foreground/30 group-data-[selected=true]:text-muted-foreground/60 transition-colors self-center shrink-0">
                ↵
              </span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>

      {/* Footer hint */}
      <div className="border-t border-border/30 px-3 py-2 flex items-center justify-between">
        <p className="text-[11px] text-muted-foreground/40">
          <kbd className="px-1 py-0.5 rounded bg-muted/50 border border-border/40 text-[10px] font-mono mr-1">↑↓</kbd>
          navigate
        </p>
        <p className="text-[11px] text-muted-foreground/40">
          <kbd className="px-1 py-0.5 rounded bg-muted/50 border border-border/40 text-[10px] font-mono mr-1">↵</kbd>
          select
        </p>
      </div>
    </CommandDialog>
  );
};
