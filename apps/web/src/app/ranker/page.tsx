"use client";

import { useMemo, useState } from "react";

type Phase = "setup" | "compare" | "result";

type MergeState = {
  left: string[];
  right: string[];
  i: number;
  j: number;
  merged: string[];
};

type RankingState = {
  phase: Phase;
  roundSublists: string[][];
  nextRoundSublists: string[][];
  pairIndex: number;
  merge: MergeState | null;
  result: string[];
  comparisons: number;
};

const MAX_ITEMS = 20;

const emptyRanking: RankingState = {
  phase: "setup",
  roundSublists: [],
  nextRoundSublists: [],
  pairIndex: 0,
  merge: null,
  result: [],
  comparisons: 0,
};

const exampleList = `Sunset Ramen\nBirch Bistro\nCopper Spoon\nSouth Street Cafe\nStreet Tacos\nGarden Grill`;

function parseInput(text: string) {
  const rawItems = text
    .split(/[\n,]+/)
    .map((item) => item.trim())
    .filter(Boolean);

  const seen = new Set<string>();
  const items: string[] = [];

  for (const item of rawItems) {
    const key = item.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    items.push(item);
  }

  return {
    items,
    rawCount: rawItems.length,
    duplicateCount: rawItems.length - items.length,
  };
}

function beginNextPair(state: RankingState): RankingState {
  let roundSublists = state.roundSublists;
  let nextRoundSublists = state.nextRoundSublists;
  let pairIndex = state.pairIndex;

  while (true) {
    if (pairIndex >= roundSublists.length) {
      if (nextRoundSublists.length === 1) {
        return {
          ...state,
          phase: "result",
          result: nextRoundSublists[0],
          roundSublists: nextRoundSublists,
          nextRoundSublists: [],
          pairIndex: 0,
          merge: null,
        };
      }

      roundSublists = nextRoundSublists;
      nextRoundSublists = [];
      pairIndex = 0;
      continue;
    }

    if (pairIndex === roundSublists.length - 1) {
      nextRoundSublists = [...nextRoundSublists, roundSublists[pairIndex]];
      pairIndex += 1;
      continue;
    }

    const left = roundSublists[pairIndex];
    const right = roundSublists[pairIndex + 1];

    return {
      ...state,
      phase: "compare",
      roundSublists,
      nextRoundSublists,
      pairIndex,
      merge: {
        left,
        right,
        i: 0,
        j: 0,
        merged: [],
      },
    };
  }
}

export default function RankerPage() {
  const [rawInput, setRawInput] = useState("");
  const [ranking, setRanking] = useState<RankingState>(emptyRanking);
  const [listItems, setListItems] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const parsed = useMemo(() => parseInput(rawInput), [rawInput]);
  const leftItem = ranking.merge?.left[ranking.merge.i] ?? "";
  const rightItem = ranking.merge?.right[ranking.merge.j] ?? "";

  const startRanking = () => {
    const { items } = parseInput(rawInput);

    if (items.length < 2) {
      setError("Add at least two items to compare.");
      return;
    }

    if (items.length > MAX_ITEMS) {
      setError(`Keep it to ${MAX_ITEMS} items or fewer for a faster run.`);
      return;
    }

    const initialState: RankingState = {
      phase: "compare",
      roundSublists: items.map((item) => [item]),
      nextRoundSublists: [],
      pairIndex: 0,
      merge: null,
      result: [],
      comparisons: 0,
    };

    setListItems(items);
    setError(null);
    setRanking(beginNextPair(initialState));
  };

  const resetRanking = () => {
    setRanking(emptyRanking);
    setListItems([]);
    setError(null);
  };

  const handleChoice = (side: "left" | "right") => {
    setRanking((prev) => {
      if (!prev.merge) return prev;

      const { left, right, i, j, merged } = prev.merge;
      const chooseLeft = side === "left";
      const nextMerged = [...merged, chooseLeft ? left[i] : right[j]];
      const nextI = chooseLeft ? i + 1 : i;
      const nextJ = chooseLeft ? j : j + 1;
      const comparisons = prev.comparisons + 1;

      if (nextI >= left.length || nextJ >= right.length) {
        const remaining =
          nextI >= left.length ? right.slice(nextJ) : left.slice(nextI);
        const mergedComplete = [...nextMerged, ...remaining];

        const nextState: RankingState = {
          ...prev,
          comparisons,
          nextRoundSublists: [...prev.nextRoundSublists, mergedComplete],
          pairIndex: prev.pairIndex + 2,
          merge: null,
        };

        return beginNextPair(nextState);
      }

      return {
        ...prev,
        comparisons,
        merge: {
          left,
          right,
          i: nextI,
          j: nextJ,
          merged: nextMerged,
        },
      };
    });
  };

  return (
    <div className="relative space-y-10">
      <header className="flex flex-col gap-3">
        <p className="font-label text-xs uppercase tracking-[0.3em] text-secondary">
          Decision Studio
        </p>
        <h1 className="font-headline text-4xl md:text-5xl text-on-surface">
          Decision Ranker
        </h1>
        <p className="font-body text-on-surface-variant max-w-2xl text-base md:text-lg">
          Drop a list of names, answer quick pairwise questions, and get a clean
          ranked order for restaurants, priorities, or who to approach first.
        </p>
      </header>

      {ranking.phase === "setup" && (
        <section className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] animate-fade-in-up">
          <div className="relative overflow-hidden rounded-3xl border border-outline-variant/30 bg-white/80 p-6 shadow-sm">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,218,215,0.6),transparent_45%),radial-gradient(circle_at_80%_10%,rgba(202,218,255,0.5),transparent_40%),radial-gradient(circle_at_75%_80%,rgba(153,208,211,0.35),transparent_45%)]" />
            <div className="relative z-10 space-y-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="font-headline text-2xl text-on-surface">
                    Build the list
                  </h2>
                  <p className="font-body text-sm text-on-surface-variant">
                    One name per line or separated by commas. Max {MAX_ITEMS}.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setRawInput(exampleList)}
                  className="rounded-full border border-outline-variant/40 bg-white/70 px-4 py-1.5 text-xs font-label uppercase tracking-widest text-secondary transition hover:border-primary/60 hover:text-primary"
                >
                  Use sample
                </button>
              </div>

              <textarea
                value={rawInput}
                onChange={(event) => setRawInput(event.target.value)}
                placeholder="Cafe Aurora\nRamen Street\nGarden Grill"
                className="min-h-[220px] w-full rounded-2xl border border-outline-variant/40 bg-white/80 px-4 py-3 text-sm text-on-surface shadow-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
              />

              {error && (
                <div className="rounded-2xl border border-error/30 bg-error-container px-4 py-3 text-sm text-on-error-container">
                  {error}
                </div>
              )}

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={startRanking}
                  className="btn-hover-lift rounded-full bg-primary px-6 py-2.5 text-sm font-label uppercase tracking-widest text-on-primary"
                >
                  Start ranking
                </button>
                <span className="text-xs font-body text-on-surface-variant">
                  {parsed.items.length} items ready
                  {parsed.duplicateCount > 0
                    ? `, ${parsed.duplicateCount} duplicate${parsed.duplicateCount > 1 ? "s" : ""} removed`
                    : ""}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-5">
            <div className="rounded-3xl border border-outline-variant/20 bg-surface-container-low p-6">
              <h3 className="font-headline text-xl text-on-surface">
                How it works
              </h3>
              <ol className="mt-4 space-y-3 font-body text-sm text-on-surface-variant">
                <li>1. The list is split into tiny groups.</li>
                <li>2. You pick the better option from each pair.</li>
                <li>3. The winners merge into a final ranked list.</li>
              </ol>
            </div>

            <div className="rounded-3xl border border-outline-variant/20 bg-white/80 p-6">
              <p className="text-xs font-label uppercase tracking-[0.3em] text-secondary">
                Best for
              </p>
              <ul className="mt-4 space-y-2 font-body text-sm text-on-surface-variant">
                <li>Restaurant shortlists</li>
                <li>Event priorities</li>
                <li>Project ideas</li>
                <li>Who to meet first</li>
              </ul>
            </div>
          </div>
        </section>
      )}

      {ranking.phase === "compare" && ranking.merge && (
        <section className="space-y-6 animate-fade-in-up">
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-outline-variant/20 bg-surface-container-low px-5 py-3">
            <div>
              <p className="text-xs font-label uppercase tracking-[0.3em] text-secondary">
                This or that
              </p>
              <p className="font-body text-sm text-on-surface-variant">
                Comparisons: {ranking.comparisons}
              </p>
            </div>
            <div className="text-xs font-body text-on-surface-variant">
              {listItems.length} items in play
            </div>
            <button
              type="button"
              onClick={resetRanking}
              className="rounded-full border border-outline-variant/40 px-4 py-1.5 text-xs font-label uppercase tracking-widest text-secondary transition hover:border-primary/60 hover:text-primary"
            >
              Edit list
            </button>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <button
              type="button"
              onClick={() => handleChoice("left")}
              className="group relative overflow-hidden rounded-3xl border border-outline-variant/30 bg-white/80 p-6 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,179,174,0.4),transparent_45%)] opacity-0 transition group-hover:opacity-100" />
              <div className="relative z-10 space-y-3">
                <span className="text-xs font-label uppercase tracking-[0.3em] text-secondary">
                  Option A
                </span>
                <h3 className="font-headline text-3xl text-on-surface">
                  {leftItem}
                </h3>
                <p className="font-body text-sm text-on-surface-variant">
                  Prefer this one
                </p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleChoice("right")}
              className="group relative overflow-hidden rounded-3xl border border-outline-variant/30 bg-white/80 p-6 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(202,218,255,0.5),transparent_45%)] opacity-0 transition group-hover:opacity-100" />
              <div className="relative z-10 space-y-3">
                <span className="text-xs font-label uppercase tracking-[0.3em] text-secondary">
                  Option B
                </span>
                <h3 className="font-headline text-3xl text-on-surface">
                  {rightItem}
                </h3>
                <p className="font-body text-sm text-on-surface-variant">
                  Prefer this one
                </p>
              </div>
            </button>
          </div>
        </section>
      )}

      {ranking.phase === "result" && (
        <section className="space-y-6 animate-fade-in-up">
          <div className="rounded-3xl border border-outline-variant/20 bg-surface-container-low px-6 py-5">
            <p className="text-xs font-label uppercase tracking-[0.3em] text-secondary">
              Ranked list
            </p>
            <h2 className="font-headline text-3xl text-on-surface">
              Your final order
            </h2>
            <p className="font-body text-sm text-on-surface-variant">
              {ranking.comparisons} comparisons total
            </p>
          </div>

          <div className="rounded-3xl border border-outline-variant/20 bg-white/80 p-6">
            <ol className="space-y-3">
              {ranking.result.map((item, index) => (
                <li
                  key={`${item}-${index}`}
                  className="flex items-center gap-4 rounded-2xl border border-outline-variant/20 bg-surface-container-low px-4 py-3"
                >
                  <span className="text-sm font-label uppercase tracking-widest text-secondary">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="font-headline text-lg text-on-surface">
                    {item}
                  </span>
                </li>
              ))}
            </ol>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={startRanking}
              className="btn-hover-lift rounded-full bg-primary px-6 py-2.5 text-sm font-label uppercase tracking-widest text-on-primary"
            >
              Rank again
            </button>
            <button
              type="button"
              onClick={resetRanking}
              className="rounded-full border border-outline-variant/40 px-6 py-2.5 text-sm font-label uppercase tracking-widest text-secondary transition hover:border-primary/60 hover:text-primary"
            >
              Edit list
            </button>
          </div>
        </section>
      )}
    </div>
  );
}
