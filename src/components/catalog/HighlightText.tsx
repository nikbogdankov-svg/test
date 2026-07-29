import { highlightSegments } from "@/lib/search";

export function HighlightText({
  text,
  query,
}: {
  text: string;
  query: string;
}) {
  const segments = highlightSegments(text, query);

  return (
    <>
      {segments.map((segment, index) =>
        segment.highlight ? (
          <mark
            key={`${segment.text}-${index}`}
            className="rounded-sm bg-amber-100 px-0.5 text-inherit"
          >
            {segment.text}
          </mark>
        ) : (
          <span key={`${segment.text}-${index}`}>{segment.text}</span>
        )
      )}
    </>
  );
}
