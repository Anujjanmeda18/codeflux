"use client";

import { useState } from "react";
import { Allotment } from "allotment";

import { cn } from "@/lib/utils";
import { Id } from "../../../../convex/_generated/dataModel";

const MIN_SIDEBAR_WIDTH = 200;
const MAX_SIDEBAR_WIDTH = 800;
const DEFAULT_SIDEBAR_WIDTH = 350;
const DEFAULT_MAIN_SIZE = 1000;

const Tab = ({
  label,
  isActive,
  onClick
}: {
  label: string;
  isActive: boolean;
  onClick: () => void;
}) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 h-full px-3 cursor-pointer text-muted-foreground border-r hover:bg-accent/30",
        isActive && "bg-background text-foreground"
      )}
    >
      <span className="text-sm">{label}</span>
    </div>
  );
};

// Mock File Explorer
const MockFileExplorer = () => {
  return (
    <div className="h-full bg-sidebar border-r p-4">
      <div className="text-sm font-medium mb-4">Files</div>
      <div className="space-y-1 text-sm">
        <div className="hover:bg-accent p-1 cursor-pointer">📁 src</div>
        <div className="hover:bg-accent p-1 cursor-pointer ml-4">📁 app</div>
        <div className="hover:bg-accent p-1 cursor-pointer ml-8">📄 page.tsx</div>
        <div className="hover:bg-accent p-1 cursor-pointer ml-8">📄 layout.tsx</div>
        <div className="hover:bg-accent p-1 cursor-pointer ml-4">📁 components</div>
        <div className="hover:bg-accent p-1 cursor-pointer ml-8">📄 Header.tsx</div>
        <div className="hover:bg-accent p-1 cursor-pointer ml-8">📄 Button.tsx</div>
        <div className="hover:bg-accent p-1 cursor-pointer">📄 package.json</div>
        <div className="hover:bg-accent p-1 cursor-pointer">📄 README.md</div>
      </div>
    </div>
  );
};

// Mock Editor View
const MockEditorView = () => {
  return (
    <div className="h-full bg-background p-4">
      <div className="font-mono text-sm">
        <div className="text-muted-foreground mb-2">// src/app/page.tsx</div>
        <pre className="text-foreground">
{`export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">Welcome to Polaris</h1>
      <p className="mt-4 text-lg text-muted-foreground">
        Start building your next project
      </p>
    </main>
  );
}`}
        </pre>
      </div>
    </div>
  );
};

// Mock Preview View
const MockPreviewView = () => {
  return (
    <div className="h-full w-full bg-white flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Preview</h2>
        <p className="text-muted-foreground">Your app preview will appear here</p>
      </div>
    </div>
  );
};

export const ProjectIdView = ({ 
  projectId
}: { 
  projectId: Id<"projects">
}) => {
  const [activeView, setActiveView] = useState<"editor" | "preview">("editor");

  return (
    <div className="h-full flex flex-col">
      <nav className="h-8.75 flex items-center bg-sidebar border-b">
        <Tab
          label="Code"
          isActive={activeView === "editor"}
          onClick={() => setActiveView("editor")}
        />
        <Tab
          label="Preview"
          isActive={activeView === "preview"}
          onClick={() => setActiveView("preview")}
        />
        <div className="flex-1 flex justify-end h-full items-center px-4">
          <button className="text-sm text-muted-foreground hover:text-foreground">
            Export
          </button>
        </div>
      </nav>
      <div className="flex-1 relative">
        <div className={cn(
          "absolute inset-0",
          activeView === "editor" ? "visible" : "invisible"
        )}>
          <Allotment defaultSizes={[DEFAULT_SIDEBAR_WIDTH, DEFAULT_MAIN_SIZE]}>
            <Allotment.Pane
              snap
              minSize={MIN_SIDEBAR_WIDTH}
              maxSize={MAX_SIDEBAR_WIDTH}
              preferredSize={DEFAULT_SIDEBAR_WIDTH}
            >
              <MockFileExplorer />
            </Allotment.Pane>
            <Allotment.Pane>
              <MockEditorView />
            </Allotment.Pane>
          </Allotment>
        </div>
        <div className={cn(
          "absolute inset-0",
          activeView === "preview" ? "visible" : "invisible"
        )}>
          <MockPreviewView />
        </div>
      </div>
    </div>
  );
};
