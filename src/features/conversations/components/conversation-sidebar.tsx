import ky from "ky";
import { toast } from "sonner";
import { useState } from "react";
import {
  CopyIcon,
  HistoryIcon,
  LoaderIcon,
  PlusIcon,
  CheckIcon,
  BotIcon,
  SparklesIcon,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";

import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import {
  Message,
  MessageContent,
  MessageActions,
  MessageAction,
} from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputBody,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
  type PromptInputMessage,
} from "@/components/ai-elements/prompt-input";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import {
  useConversation,
  useConversations,
  useCreateConversation,
  useMessages,
} from "../hooks/use-conversations";

import { Id } from "../../../../convex/_generated/dataModel";
import { DEFAULT_CONVERSATION_TITLE } from "../constants";
import { PastConversationsDialog } from "./past-conversations-dialog";

interface ConversationSidebarProps {
  projectId: Id<"projects">;
}

// Markdown renderer for assistant messages
const MarkdownMessage = ({ content }: { content: string }) => (
  <ReactMarkdown
    remarkPlugins={[remarkGfm]}
    components={{
      p: ({ children }) => (
        <p className="mb-2 last:mb-0 leading-relaxed text-sm">{children}</p>
      ),
      code: ({ className, children, ...props }) => {
        const isInline = !className;
        return isInline ? (
          <code
            className="px-1.5 py-0.5 rounded-md bg-muted/60 border border-border/40 text-xs font-mono text-foreground/90"
            {...props}
          >
            {children}
          </code>
        ) : (
          <code
            className="block text-xs font-mono leading-relaxed"
            {...props}
          >
            {children}
          </code>
        );
      },
      pre: ({ children }) => (
        <pre className="my-2 rounded-lg bg-black/40 border border-border/30 p-3 overflow-x-auto text-xs font-mono scrollbar-thin">
          {children}
        </pre>
      ),
      ul: ({ children }) => (
        <ul className="my-1.5 ml-4 space-y-1 list-disc text-sm">{children}</ul>
      ),
      ol: ({ children }) => (
        <ol className="my-1.5 ml-4 space-y-1 list-decimal text-sm">{children}</ol>
      ),
      li: ({ children }) => (
        <li className="leading-relaxed text-sm">{children}</li>
      ),
      h1: ({ children }) => (
        <h1 className="text-base font-semibold mt-3 mb-1.5">{children}</h1>
      ),
      h2: ({ children }) => (
        <h2 className="text-sm font-semibold mt-3 mb-1.5">{children}</h2>
      ),
      h3: ({ children }) => (
        <h3 className="text-sm font-medium mt-2 mb-1 text-foreground/80">{children}</h3>
      ),
      blockquote: ({ children }) => (
        <blockquote className="border-l-2 border-primary/40 pl-3 my-2 text-muted-foreground italic text-sm">
          {children}
        </blockquote>
      ),
      hr: () => <hr className="border-border/30 my-3" />,
      strong: ({ children }) => (
        <strong className="font-semibold text-foreground">{children}</strong>
      ),
      a: ({ href, children }) => (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary underline underline-offset-2 hover:text-primary/80 transition-colors"
        >
          {children}
        </a>
      ),
    }}
  >
    {content}
  </ReactMarkdown>
);

// Thinking animation dots
const ThinkingIndicator = () => (
  <div className="flex items-center gap-2 text-muted-foreground py-1">
    <div className="flex gap-1">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="size-1.5 rounded-full bg-primary/60 animate-bounce"
          style={{ animationDelay: `${i * 150}ms` }}
        />
      ))}
    </div>
    <span className="text-xs text-muted-foreground/60">Thinking...</span>
  </div>
);

export const ConversationSidebar = ({ projectId }: ConversationSidebarProps) => {
  const [input, setInput] = useState("");
  const [copied, setCopied] = useState<string | null>(null);
  const [selectedConversationId, setSelectedConversationId] =
    useState<Id<"conversations"> | null>(null);
  const [pastConversationsOpen, setPastConversationsOpen] = useState(false);

  const createConversation = useCreateConversation();
  const conversations = useConversations(projectId);

  const activeConversationId =
    selectedConversationId ?? conversations?.[0]?._id ?? null;

  const activeConversation = useConversation(activeConversationId);
  const conversationMessages = useMessages(activeConversationId);

  const isProcessing = conversationMessages?.some(
    (msg) => msg.status === "processing"
  );

  const handleCancel = async () => {
    try {
      await ky.post("/api/messages/cancel", { json: { projectId } });
    } catch {
      toast.error("Unable to cancel request");
    }
  };

  const handleCreateConversation = async () => {
    try {
      const newConversationId = await createConversation({
        projectId,
        title: DEFAULT_CONVERSATION_TITLE,
      });
      setSelectedConversationId(newConversationId);
      return newConversationId;
    } catch {
      toast.error("Unable to create new conversation");
      return null;
    }
  };

  const handleSubmit = async (message: PromptInputMessage) => {
    if (isProcessing && !message.text) {
      await handleCancel();
      setInput("");
      return;
    }

    let conversationId = activeConversationId;
    if (!conversationId) {
      conversationId = await handleCreateConversation();
      if (!conversationId) return;
    }

    try {
      await ky.post("/api/messages", {
        json: { conversationId, message: message.text },
      });
    } catch {
      toast.error("Message failed to send");
    }

    setInput("");
  };

  const handleCopy = (id: string, content: string) => {
    navigator.clipboard.writeText(content);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const isLastAssistantMessage = (index: number) =>
    index === (conversationMessages?.length ?? 0) - 1;

  return (
    <>
      <PastConversationsDialog
        projectId={projectId}
        open={pastConversationsOpen}
        onOpenChange={setPastConversationsOpen}
        onSelect={setSelectedConversationId}
      />

      <div className="flex flex-col h-full bg-sidebar">
        {/* Header */}
        <div className="flex items-center justify-between px-3 border-b border-border/50 h-[35px] shrink-0">
          <div className="flex items-center gap-1.5 min-w-0">
            <SparklesIcon className="size-3 text-primary/60 shrink-0" />
            <span className="text-xs font-medium text-muted-foreground truncate">
              {activeConversation?.title === DEFAULT_CONVERSATION_TITLE ||
              !activeConversation?.title
                ? "New Conversation"
                : activeConversation.title}
            </span>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon-xs"
                  variant="highlight"
                  onClick={() => setPastConversationsOpen(true)}
                >
                  <HistoryIcon className="size-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Past conversations</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon-xs"
                  variant="highlight"
                  onClick={handleCreateConversation}
                >
                  <PlusIcon className="size-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>New conversation</TooltipContent>
            </Tooltip>
          </div>
        </div>

        {/* Messages */}
        <Conversation className="flex-1">
          <ConversationContent className="px-3 py-3 space-y-4">
            {/* Empty state */}
            {(!conversationMessages || conversationMessages.length === 0) && (
              <div className="flex flex-col items-center justify-center h-full gap-3 py-12 text-center">
                <div className="p-3 rounded-2xl bg-primary/10 border border-primary/20">
                  <BotIcon className="size-6 text-primary/60" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground/80">
                    How can I help?
                  </p>
                  <p className="text-xs text-muted-foreground/50 mt-0.5">
                    Ask me to build, edit, or explain anything
                  </p>
                </div>
              </div>
            )}

            {conversationMessages?.map((message, messageIndex) => (
              <Message key={message._id} from={message.role}>
                {/* User message */}
                {message.role === "user" && (
                  <div className="flex justify-end">
                    <div className="max-w-[85%] px-3 py-2 rounded-2xl rounded-tr-sm bg-primary/15 border border-primary/20 text-sm text-foreground leading-relaxed">
                      {message.content}
                    </div>
                  </div>
                )}

                {/* Assistant message */}
                {message.role === "assistant" && (
                  <div className="flex flex-col gap-1">
                    <MessageContent className="text-sm text-foreground/90 leading-relaxed">
                      {message.status === "processing" ? (
                        <ThinkingIndicator />
                      ) : message.status === "cancelled" ? (
                        <span className="text-muted-foreground/50 italic text-xs">
                          Request cancelled
                        </span>
                      ) : (
                        <MarkdownMessage content={message.content} />
                      )}
                    </MessageContent>

                    {/* Copy action — only on last assistant message */}
                    {message.status === "completed" &&
                      isLastAssistantMessage(messageIndex) && (
                        <MessageActions className="mt-1">
                          <MessageAction
                            onClick={() => handleCopy(message._id, message.content)}
                            label="Copy"
                            className={cn(
                              "transition-colors",
                              copied === message._id && "text-green-500"
                            )}
                          >
                            {copied === message._id ? (
                              <CheckIcon className="size-3" />
                            ) : (
                              <CopyIcon className="size-3" />
                            )}
                          </MessageAction>
                        </MessageActions>
                      )}
                  </div>
                )}
              </Message>
            ))}
          </ConversationContent>
          <ConversationScrollButton />
        </Conversation>

        {/* Input */}
        <div className="p-3 pt-2 border-t border-border/30">
          <PromptInput
            onSubmit={handleSubmit}
            className="border border-border/40 rounded-xl bg-background/30 focus-within:border-primary/40 transition-all duration-200"
          >
            <PromptInputBody>
              <PromptInputTextarea
                placeholder="Ask CodeFlux anything..."
                onChange={(e) => setInput(e.target.value)}
                value={input}
                disabled={isProcessing}
                className="text-sm placeholder:text-muted-foreground/40 min-h-[60px]"
              />
            </PromptInputBody>
            <PromptInputFooter className="border-t border-border/20">
              <PromptInputTools />
              <PromptInputSubmit
                disabled={isProcessing ? false : !input}
                status={isProcessing ? "streaming" : undefined}
              />
            </PromptInputFooter>
          </PromptInput>
        </div>
      </div>
    </>
  );
};
