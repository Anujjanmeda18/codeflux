"use client";

import { useState } from "react";
import { Allotment } from "allotment";
import {
  Loader2Icon,
  TerminalSquareIcon,
  AlertTriangleIcon,
  RefreshCwIcon,
} from "lucide-react";

import { useWebContainer } from "@/features/preview/hooks/use-webcontainer";
import { PreviewSettingsPopover } from "@/features/preview/components/preview-settings-popover";
import { PreviewTerminal } from "@/features/preview/components/preview-terminal";

import { Button } from "@/components/ui/button";
import { useProject } from "../hooks/use-projects";
import { Id } from "../../../../convex/_generated/dataModel";

export const PreviewView = ({ projectId }: { projectId: Id<"projects"> }) => {
  const project = useProject(projectId);
  const [showTerminal, setShowTerminal] = useState(true);

  const {
    status, previewUrl, error, restart, terminalOutput
  } = useWebContainer({
    projectId,
    enabled: true,
    settings: project?.settings,
  });

  const isLoading = status === "booting" || status === "installing";

  // Fix: Replace webpack dev URL with proper preview path
  const fixedPreviewUrl = previewUrl?.replace('/webpack-dev-server', '');

  return (
    <div className="h-full w-full flex flex-col bg-background overflow-hidden">
      <div className="h-9 flex items-center border-b bg-sidebar shrink-0 flex-shrink-0"> {/* Fixed height */}
        <Button
          size="sm"
          variant="ghost"
          className="h-full rounded-none"
          disabled={isLoading}
          onClick={restart}
          title="Restart container"
        >
          <RefreshCwIcon className="size-3" />
        </Button>

        <div className="flex-1 h-full flex items-center px-3 bg-background border-x text-xs text-muted-foreground truncate font-mono">
          {isLoading && (
            <div className="flex items-center gap-1.5">
              <Loader2Icon className="size-3 animate-spin" />
              {status === "booting" ? "Starting..." : "Installing..."}
            </div>
          )}
          {fixedPreviewUrl && <span className="truncate">{fixedPreviewUrl}</span>}
          {!isLoading && !previewUrl && !error && <span>Ready to preview</span>}
        </div>

        <Button
          size="sm"
          variant="ghost"
          className="h-full rounded-none"
          title="Toggle terminal"
          onClick={() => setShowTerminal((value) => !value)}
        >
          <TerminalSquareIcon className="size-3" />
        </Button>
        <PreviewSettingsPopover
          projectId={projectId}
          initialValues={project?.settings}
          onSave={restart}
        />
      </div>

      <div className="flex-1 min-h-0 overflow-hidden">
        <Allotment vertical className="h-full">
          <Allotment.Pane minSize={0}>
            {error && (
              <div className="h-full flex items-center justify-center p-8 text-muted-foreground">
                <div className="flex flex-col items-center gap-2 max-w-md text-center">
                  <AlertTriangleIcon className="size-6" />
                  <p className="text-sm font-medium">{error}</p>
                  <Button size="sm" variant="outline" onClick={restart}>
                    <RefreshCwIcon className="size-4 mr-2" />
                    Restart
                  </Button>
                </div>
              </div>
            )}

            {isLoading && !error && (
              <div className="h-full flex items-center justify-center p-8 text-muted-foreground">
                <div className="flex flex-col items-center gap-2 max-w-md text-center">
                  <Loader2Icon className="size-6 animate-spin" />
                  <p className="text-sm font-medium">
                    {status === "booting" ? "Booting WebContainer..." : "Installing dependencies..."}
                  </p>
                </div>
              </div>
            )}

            {fixedPreviewUrl && (
              <iframe
                src={fixedPreviewUrl}
                className="w-full h-full border-0 bg-white"
                title={`Preview ${projectId}`}
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
              />
            )}
          </Allotment.Pane>

          {showTerminal && (
            <Allotment.Pane minSize={100} maxSize={500} preferredSize={200}>
              <div className="h-full flex flex-col bg-black/90 border-t border-neutral-800">
                <div className="h-7 flex items-center px-3 text-xs gap-1.5 text-muted-foreground border-b border-neutral-700/50 shrink-0">
                  <TerminalSquareIcon className="size-3" />
                  Terminal
                </div>
                <PreviewTerminal output={terminalOutput} />
              </div>
            </Allotment.Pane>
          )}
        </Allotment>
      </div>
    </div>
  );
};