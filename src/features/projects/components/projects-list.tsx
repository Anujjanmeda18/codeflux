import Link from "next/link";
import { FaGithub } from "react-icons/fa";
import { formatDistanceToNow } from "date-fns";
import {
  AlertCircleIcon,
  ArrowRightIcon,
  GlobeIcon,
  Loader2Icon,
} from "lucide-react";

import { Kbd } from "@/components/ui/kbd";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";

import { Doc } from "../../../../convex/_generated/dataModel";

// import { useProjectsPartial } from "../hooks/use-projects";

const formatTimestamp = (timestamp: number) => {
  return formatDistanceToNow(new Date(timestamp), {
    addSuffix: true,
  });
};

const getProjectIcon = (project: Doc<"projects">) => {
  if (project.importStatus === "completed") {
    return <FaGithub className="size-3.5 text-muted-foreground" />;
  }

  if (project.importStatus === "failed") {
    return <AlertCircleIcon className="size-3.5 text-muted-foreground" />;
  }

  if (project.importStatus === "importing") {
    return (
      <Loader2Icon className="size-3.5 text-muted-foreground animate-spin" />
    );
  }

  return <GlobeIcon className="size-3.5 text-muted-foreground" />;
};

interface ProjectsListProps {
  onViewAll: () => void;
}

const ContinueCard = ({ data }: { data: Doc<"projects"> }) => {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs text-muted-foreground">Last updated</span>
      <Button
        variant="outline"
        asChild
        className="h-auto items-start justify-start p-4 bg-background border rounded-none flex flex-col gap-2"
      >
        <Link href={`/projects/${data._id}`} className="group">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              {getProjectIcon(data)}
              <span className="font-medium truncate">{data.name}</span>
            </div>
            <ArrowRightIcon className="size-4 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
          </div>
          <span className="text-xs text-muted-foreground">
            {formatTimestamp(data.updatedAt)}
          </span>
        </Link>
      </Button>
    </div>
  );
};

const ProjectItem = ({ data }: { data: Doc<"projects"> }) => {
  return (
    <Link
      href={`/projects/${data._id}`}
      className="text-sm text-foreground/60 font-medium hover:text-foreground py-1 flex items-center justify-between w-full group"
    >
      <div className="flex items-center gap-2">
        {getProjectIcon(data)}
        <span className="truncate">{data.name}</span>
      </div>
      <span className="text-xs text-muted-foreground group-hover:text-foreground/60 transition-colors">
        {formatTimestamp(data.updatedAt)}
      </span>
    </Link>
  );
};

// Hardcoded mock data
// Hardcoded mock data matching your actual schema
const MOCK_PROJECTS: Doc<"projects">[] = [
  {
    _id: "k17abc123def456gh" as any,
    _creationTime: Date.now() - 5 * 60 * 1000,
    name: "Vibely Social Platform",
    ownerId: "user123",
    updatedAt: Date.now() - 5 * 60 * 1000,
    importStatus: "completed",
  },
  {
    _id: "k17def456ghi789jk" as any,
    _creationTime: Date.now() - 2 * 60 * 60 * 1000,
    name: "Intervue AI",
    ownerId: "user123",
    updatedAt: Date.now() - 2 * 60 * 60 * 1000,
    importStatus: "completed",
  },
  {
    _id: "k17ghi789jkl012mn" as any,
    _creationTime: Date.now() - 24 * 60 * 60 * 1000,
    name: "Genova.ai",
    ownerId: "user123",
    updatedAt: Date.now() - 24 * 60 * 60 * 1000,
    importStatus: "importing",
  },
  {
    _id: "k17jkl012mno345pq" as any,
    _creationTime: Date.now() - 3 * 24 * 60 * 60 * 1000,
    name: "E-commerce Dashboard",
    ownerId: "user123",
    updatedAt: Date.now() - 3 * 24 * 60 * 60 * 1000,
    importStatus: "completed",
    exportStatus: "completed",
    exportRepoUrl: "https://github.com/username/ecommerce-dash",
  },
  {
    _id: "k17mno345pqr678st" as any,
    _creationTime: Date.now() - 7 * 24 * 60 * 60 * 1000,
    name: "Portfolio Website",
    ownerId: "user123",
    updatedAt: Date.now() - 7 * 24 * 60 * 60 * 1000,
    importStatus: "failed",
  },
  {
    _id: "k17pqr678stu901vw" as any,
    _creationTime: Date.now() - 14 * 24 * 60 * 60 * 1000,
    name: "Task Manager App",
    ownerId: "user123",
    updatedAt: Date.now() - 14 * 24 * 60 * 60 * 1000,
    importStatus: "completed",
    exportStatus: "exporting",
  },
];


export const ProjectsList = ({ onViewAll }: ProjectsListProps) => {
  // const projects = useProjectsPartial(6);
  const projects = MOCK_PROJECTS; // Using hardcoded data

  if (projects === undefined) {
    return <Spinner className="size-4 text-ring" />;
  }

  const [mostRecent, ...rest] = projects;

  return (
    <div className="flex flex-col gap-4">
      {mostRecent ? <ContinueCard data={mostRecent} /> : null}
      {rest.length > 0 && (
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs text-muted-foreground">
              Recent projects
            </span>
            <button
              onClick={onViewAll}
              className="flex items-center gap-2 text-muted-foreground text-xs hover:text-foreground transition-colors"
            >
              <span>View all</span>
              <Kbd className="bg-accent border">⌘K</Kbd>
            </button>
          </div>
          <ul className="flex flex-col">
            {rest.map((project) => (
              <ProjectItem key={project._id} data={project} />
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
