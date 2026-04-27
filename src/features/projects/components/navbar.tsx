"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { CloudCheckIcon, LoaderIcon, GitBranchIcon, MoreVerticalIcon, TrashIcon } from "lucide-react";
import { UserButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Poppins } from "next/font/google";
import { formatDistanceToNow } from "date-fns";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { Id } from "../../../../convex/_generated/dataModel";
import { useProject, useRenameProject, useDeleteProject } from "../hooks/use-projects";

const font = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const Navbar = ({ projectId }: { projectId: Id<"projects"> }) => {
  const router = useRouter();
  const project = useProject(projectId);
  const renameProject = useRenameProject();
  const deleteProject = useDeleteProject();

  const [isRenaming, setIsRenaming] = useState(false);
  const [name, setName] = useState("");

  const handleStartRename = () => {
    if (!project) return;
    setName(project.name);
    setIsRenaming(true);
  };

  const handleSubmit = () => {
    if (!project) return;
    setIsRenaming(false);
    const trimmedName = name.trim();
    if (!trimmedName || trimmedName === project.name) return;
    renameProject({ id: projectId, name: trimmedName });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSubmit();
    else if (e.key === "Escape") setIsRenaming(false);
  };

  const handleDelete = () => {
    const confirm = window.confirm("Are you sure you want to delete this project?");
    if (confirm) {
      deleteProject({ id: projectId });
      router.push("/");
    }
  };

  return (
    <nav className="flex justify-between items-center gap-x-2 px-3 py-1.5 bg-sidebar border-b border-border/50 backdrop-blur-sm">
      {/* Left side */}
      <div className="flex items-center gap-x-1.5">
        <Breadcrumb>
          <BreadcrumbList className="gap-0!">
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Button
                  variant="ghost"
                  className="w-fit! px-2! h-7! gap-1.5 hover:bg-white/5 transition-colors"
                  asChild
                >
                  <Link href="/">
                    <Image src="/logo.svg" alt="Logo" width={18} height={18} />
                    <span
                      className={cn(
                        "text-sm font-semibold tracking-tight bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent",
                        font.className
                      )}
                    >
                      CodeFlux
                    </span>
                  </Link>
                </Button>
              </BreadcrumbLink>
            </BreadcrumbItem>

            <BreadcrumbSeparator className="mx-1 text-muted-foreground/40" />

            <BreadcrumbItem>
              {isRenaming ? (
                <input
                  autoFocus
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onFocus={(e) => e.currentTarget.select()}
                  onBlur={handleSubmit}
                  onKeyDown={handleKeyDown}
                  className="text-sm bg-white/5 text-foreground outline-none focus:ring-1 focus:ring-inset focus:ring-primary/50 font-medium max-w-44 truncate rounded px-1.5 py-0.5"
                />
              ) : (
                <BreadcrumbPage
                  onClick={handleStartRename}
                  className="text-sm cursor-pointer hover:text-foreground text-muted-foreground font-medium max-w-44 truncate transition-colors px-1 py-0.5 rounded hover:bg-white/5"
                >
                  {project?.name ?? "Loading..."}
                </BreadcrumbPage>
              )}
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Save status */}
        {project?.importStatus === "importing" ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-1 text-xs text-muted-foreground/60 px-1.5">
                <LoaderIcon className="size-3 animate-spin" />
                <span>Importing...</span>
              </div>
            </TooltipTrigger>
            <TooltipContent>Syncing with GitHub</TooltipContent>
          </Tooltip>
        ) : (
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-1 text-xs text-muted-foreground/50 px-1.5 cursor-default">
                <CloudCheckIcon className="size-3" />
                <span className="hidden sm:inline">
                  {project?.updatedAt
                    ? `Saved ${formatDistanceToNow(project.updatedAt, { addSuffix: true })}`
                    : "Saved"}
                </span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              All changes saved
              {project?.updatedAt &&
                ` · ${formatDistanceToNow(project.updatedAt, { addSuffix: true })}`}
            </TooltipContent>
          </Tooltip>
        )}
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
              <MoreVerticalIcon className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleDelete} className="text-destructive focus:text-destructive cursor-pointer">
              <TrashIcon className="size-4 mr-2" />
              Delete Project
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <UserButton
          appearance={{
            elements: {
              avatarBox: "size-7",
            },
          }}
        />
      </div>
    </nav>
  );
};
