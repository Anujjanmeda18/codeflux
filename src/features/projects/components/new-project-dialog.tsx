"use client";

import { useEffect, useState } from "react";
import ky from "ky";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { SparklesIcon } from "lucide-react";
import { Poppins } from "next/font/google";
import { cn } from "@/lib/utils";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  PromptInput,
  PromptInputBody,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
  type PromptInputMessage,
} from "@/components/ai-elements/prompt-input";

import { Id } from "../../../../convex/_generated/dataModel";

const font = Poppins({
  subsets: ["latin"],
  weight: ["600", "700"],
});

interface NewProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const NewProjectDialog = ({
  open,
  onOpenChange,
}: NewProjectDialogProps) => {
  const router = useRouter();
  const [input, setInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (message: PromptInputMessage) => {
    if (!message.text) return;
    setIsSubmitting(true);

    try {
      const { projectId } = await ky
        .post("/api/projects/create-with-prompt", {
          json: { prompt: message.text.trim() },
        })
        .json<{ projectId: Id<"projects"> }>();

      toast.success("Project created");
      onOpenChange(false);
      setInput("");
      router.push(`/projects/${projectId}`);
    } catch {
      toast.error("Unable to create project");
    } finally {
      setIsSubmitting(false);
    }
  };

  const suggestions = [
    "A todo app with drag and drop",
    "A markdown blog with dark mode",
    "A dashboard with charts",
    "A REST API with auth",
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="sm:max-w-xl p-0 overflow-hidden border-border/50 bg-sidebar shadow-2xl shadow-black/50"
      >
        <DialogHeader className="hidden">
          <DialogTitle>What do you want to build?</DialogTitle>
          <DialogDescription>
            Describe your project and AI will help you create it.
          </DialogDescription>
        </DialogHeader>

        {/* Header */}
        <div className="px-5 pt-5 pb-3 flex items-center gap-2.5">
          <div className="p-1.5 rounded-md bg-primary/10 border border-primary/20">
            <SparklesIcon className="size-4 text-primary" />
          </div>
          <div>
            <h2 className={cn("text-sm font-semibold text-foreground", font.className)}>
              What do you want to build?
            </h2>
            <p className="text-xs text-muted-foreground">
              Describe your project and AI will generate it
            </p>
          </div>
        </div>

        {/* Prompt Input */}
        <div className="px-3 pb-2">
          <PromptInput
            onSubmit={handleSubmit}
            className="border border-border/50 rounded-xl bg-background/50 hover:border-border transition-colors"
          >
            <PromptInputBody>
              <PromptInputTextarea
                placeholder="e.g. Build a todo app with drag and drop..."
                onChange={(e) => setInput(e.target.value)}
                value={input}
                disabled={isSubmitting}
                className="min-h-[80px] text-sm placeholder:text-muted-foreground/50"
              />
            </PromptInputBody>
            <PromptInputFooter className="border-t border-border/30">
              <PromptInputTools />
              <PromptInputSubmit disabled={!input || isSubmitting} />
            </PromptInputFooter>
          </PromptInput>
        </div>

        {/* Quick suggestions */}
        <div className="px-4 pb-4">
          <p className="text-xs text-muted-foreground/50 mb-2">Suggestions</p>
          <div className="flex flex-wrap gap-1.5">
            {suggestions.map((s) => (
              <button
                key={s}
                onClick={() => setInput(s)}
                className="text-xs px-2.5 py-1 rounded-full border border-border/40 text-muted-foreground hover:text-foreground hover:border-border hover:bg-white/5 transition-all"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
