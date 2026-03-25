"use client";

import { Allotment } from "allotment";
import { ConversationSidebar } from "@/features/conversations/components/conversation-sidebar";
import { Navbar } from "./navbar";
import { Id } from "../../../../convex/_generated/dataModel";

const MIN_SIDEBAR_WIDTH = 200;
const MAX_SIDEBAR_WIDTH = 800;
const DEFAULT_CONVERSATION_SIDEBAR_WIDTH = 400;
const DEFAULT_MAIN_SIZE = 1000;

export const ProjectIdLayout = ({
  children,
  projectId,
}: {
  children: React.ReactNode;
  projectId: Id<"projects">;
}) => {
  return (
    <div className="h-dvh w-screen flex flex-col bg-background overflow-hidden"> {/* dvh for mobile */}
      <Navbar projectId={projectId} className="flex-shrink-0 h-12 shrink-0" />
      <div className="flex-1 min-h-0 overflow-hidden flex">
        <Allotment
          className="h-full w-full flex-1"
          defaultSizes={[DEFAULT_CONVERSATION_SIDEBAR_WIDTH, DEFAULT_MAIN_SIZE]}
        >
          <Allotment.Pane
            snap
            minSize={MIN_SIDEBAR_WIDTH}
            maxSize={MAX_SIDEBAR_WIDTH}
            preferredSize={DEFAULT_CONVERSATION_SIDEBAR_WIDTH}
          >
            <div className="h-full overflow-auto"> {/* Scroll wrapper */}
              <ConversationSidebar projectId={projectId} />
            </div>
          </Allotment.Pane>
          <Allotment.Pane>
            <div className="h-full min-w-0 overflow-auto">
              {children}
            </div>
          </Allotment.Pane>
        </Allotment>
      </div>
    </div>
  );
};