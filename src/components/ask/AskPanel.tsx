"use client";

import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import { ArrowUp, Quote } from "lucide-react";
import { askExamples, type AskExample } from "@/data/askExamples";
import { usePersona } from "@/hooks/usePersona";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ChatTurn {
  id: string;
  question: string;
  example: AskExample;
}

export function AskPanel() {
  const { persona } = usePersona();
  const [question, setQuestion] = useState("");
  const [turns, setTurns] = useState<ChatTurn[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);
  const firstName = persona.name.split(" ")[0];

  const suggestions = useMemo(() => askExamples.slice(0, 4), []);

  function resolveExample(text: string): AskExample {
    const normalized = text.trim().toLowerCase();
    return (
      askExamples.find((item) =>
        normalized.includes(item.question.toLowerCase().slice(0, 24))
      ) ||
      askExamples.find((item) =>
        item.question
          .toLowerCase()
          .split(" ")
          .some((word) => word.length > 5 && normalized.includes(word))
      ) ||
      askExamples[0]
    );
  }

  function runAsk(nextQuestion?: string) {
    const text = (nextQuestion ?? question).trim();
    if (!text) return;

    const example = resolveExample(text);
    setTurns((prev) => [
      ...prev,
      {
        id: `${Date.now()}-${example.id}`,
        question: text,
        example,
      },
    ]);
    setQuestion("");
    window.setTimeout(() => {
      bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    }, 50);
  }

  return (
    <div className="-mx-6 -my-6 flex h-[calc(100vh-3.5rem)] flex-col bg-[#F7F7F5]">
      <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col overflow-hidden px-4">
        <div className="flex-1 overflow-y-auto py-8">
          {turns.length === 0 ? (
            <div className="flex h-full min-h-[320px] flex-col items-center justify-center text-center">
              <h1 className="text-3xl font-semibold tracking-tight text-neutral-900 sm:text-4xl">
                {firstName}, what do you want to ask today?
              </h1>
              <div className="mt-8 flex w-full max-w-2xl flex-wrap justify-center gap-2">
                {suggestions.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => runAsk(item.question)}
                    className="max-w-full rounded-full border border-neutral-200 bg-white px-3.5 py-2 text-left text-sm text-neutral-700 transition-colors hover:bg-neutral-50"
                  >
                    {item.question}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-8 pb-4">
              {turns.map((turn) => (
                <div key={turn.id} className="space-y-4">
                  <div className="flex justify-end">
                    <div className="max-w-[85%] rounded-2xl rounded-br-none bg-neutral-200 px-4 py-2.5 text-sm text-neutral-900">
                      {turn.question}
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <Quote className="mt-1 h-4 w-4 shrink-0 text-neutral-400" />
                      <p className="text-sm leading-relaxed text-neutral-800">
                        {turn.example.answer}
                      </p>
                    </div>
                    <p className="text-xs text-neutral-500">
                      {turn.example.permissionNote}
                    </p>
                    <ul className="space-y-1 border-l border-neutral-200 pl-3">
                      {turn.example.citations.map((citation) => (
                        <li
                          key={`${turn.id}-${citation.datasetId}`}
                          className="text-sm text-neutral-400"
                        >
                          {persona.navKeys.includes("catalog") ? (
                            <Link
                              href={`/catalog/${citation.datasetId}`}
                              className="font-medium text-neutral-600 hover:text-neutral-900 hover:underline"
                            >
                              {citation.datasetName}
                            </Link>
                          ) : (
                            <span className="font-medium text-neutral-600">
                              {citation.datasetName}
                            </span>
                          )}
                          <span> · {citation.note}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
              <div ref={bottomRef} />
            </div>
          )}
        </div>

        <div className="sticky bottom-0 pb-5 pt-2">
          <form
            onSubmit={(event) => {
              event.preventDefault();
              runAsk();
            }}
            className="rounded-3xl border border-neutral-200 bg-white px-3 py-2"
          >
            <label htmlFor="ask-input" className="sr-only">
              Ask a question
            </label>
            <textarea
              id="ask-input"
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  runAsk();
                }
              }}
              rows={1}
              placeholder="Ask anything about governed city data…"
              className="max-h-40 min-h-[48px] w-full resize-none bg-transparent px-2 py-3 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus-visible:outline-none focus-visible:ring-0"
            />
            <div className="flex items-center justify-between gap-2 px-1 pb-1">
              <p className="text-[11px] text-neutral-400">
                Enter to send · Shift+Enter for a new line
              </p>
              <Button
                type="submit"
                size="icon"
                disabled={!question.trim()}
                className={cn("h-9 w-9 rounded-full")}
                aria-label="Send"
              >
                <ArrowUp className="h-4 w-4" />
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
