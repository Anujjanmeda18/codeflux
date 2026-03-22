"use client";

import { Allotment } from "allotment";

import { Navbar } from "./navbar";
import { Id } from "../../../../convex/_generated/dataModel";

const MIN_SIDEBAR_WIDTH = 200;
const MAX_SIDEBAR_WIDTH = 800;
const DEFAULT_CONVERSATION_SIDEBAR_WIDTH = 400;
const DEFAULT_MAIN_SIZE = 1000;

// Mock Conversation Sidebar
const MockConversationSidebar = () => {
  return (
    <div className="h-full bg-sidebar border-r flex flex-col">
      <div className="p-4 border-b">
        <h2 className="font-semibold text-sm">Conversations</h2>
      </div>
      <div className="flex-1 overflow-y-auto p-2">
        <div className="space-y-1">
          <div className="p-3 hover:bg-accent rounded cursor-pointer">
            <div className="font-medium text-sm">How to implement auth?</div>
            <div className="text-xs text-muted-foreground mt-1">2 hours ago</div>
          </div>
          <div className="p-3 hover:bg-accent rounded cursor-pointer">
            <div className="font-medium text-sm">Fix TypeScript errors</div>
            <div className="text-xs text-muted-foreground mt-1">5 hours ago</div>
          </div>
          <div className="p-3 hover:bg-accent rounded cursor-pointer">
            <div className="font-medium text-sm">Deploy to Vercel</div>
            <div className="text-xs text-muted-foreground mt-1">Yesterday</div>
          </div>
          <div className="p-3 hover:bg-accent rounded cursor-pointer">
            <div className="font-medium text-sm">Add dark mode</div>
            <div className="text-xs text-muted-foreground mt-1">2 days ago</div>
          </div>
        </div>
      </div>
      <div className="p-4 border-t">
        <button className="w-full p-2 text-sm bg-primary text-primary-foreground rounded hover:bg-primary/90">
          New Conversation
        </button>
      </div>
    </div>
  );
};

export const ProjectIdLayout = ({
  children,
  projectId,
}: {
  children: React.ReactNode;
  projectId: Id<"projects">;
}) => {
  return (
    <div className="w-full h-screen flex flex-col">
      <Navbar projectId={projectId} />
      <div className="flex-1 flex overflow-hidden">
        <Allotment
          className="flex-1"
          defaultSizes={[
            DEFAULT_CONVERSATION_SIDEBAR_WIDTH,
            DEFAULT_MAIN_SIZE
          ]}
        >
          <Allotment.Pane
            snap
            minSize={MIN_SIDEBAR_WIDTH}
            maxSize={MAX_SIDEBAR_WIDTH}
            preferredSize={DEFAULT_CONVERSATION_SIDEBAR_WIDTH}
          >
            <MockConversationSidebar />
          </Allotment.Pane>
          <Allotment.Pane>
            {children}
          </Allotment.Pane>
        </Allotment>
      </div>
    </div>
  );
};
