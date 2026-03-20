"use client";

import { motion } from "framer-motion";

function SkeletonLine({ w = "100%", h = 12 }: { w?: string; h?: number }) {
  return (
    <div
      className="animate-pulse rounded-full bg-gray-200 dark:bg-white/[0.06]"
      style={{ width: w, height: h }}
    />
  );
}

function SkeletonCard({ delay }: { delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay, duration: 0.3 }}
      className="rounded-xl border border-gray-100 dark:border-white/[0.06] bg-gray-50/50 dark:bg-white/[0.015] p-4 space-y-3"
    >
      <div className="flex items-center justify-between">
        <SkeletonLine w="58%" />
        <div className="h-5 w-16 animate-pulse rounded-full bg-gray-200 dark:bg-white/[0.06]" />
      </div>
      <div className="flex gap-3">
        <SkeletonLine w="30%" h={10} />
        <SkeletonLine w="22%" h={10} />
      </div>
    </motion.div>
  );
}

export function ResultSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      {/* Summary bar skeleton */}
      <div className="rounded-2xl border border-gray-100 dark:border-white/[0.06] overflow-hidden">
        {/* AI summary text area */}
        <div className="px-5 py-4 bg-indigo-50/30 dark:bg-indigo-500/[0.03] border-b border-gray-100 dark:border-white/[0.06] space-y-2">
          <SkeletonLine w="20%" h={9} />
          <SkeletonLine w="92%" />
          <SkeletonLine w="74%" />
        </div>
        {/* Stats row */}
        <div className="grid grid-cols-5 divide-x divide-gray-100 dark:divide-white/[0.05]">
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} className="flex flex-col items-center gap-2 px-3 py-3">
              <div className="h-6 w-8 animate-pulse rounded-md bg-gray-200 dark:bg-white/[0.06]" />
              <SkeletonLine w="70%" h={8} />
            </div>
          ))}
        </div>
      </div>

      {/* Priority strip skeleton */}
      <div className="flex gap-2">
        {["w-20", "w-24", "w-20"].map((w, i) => (
          <div key={i} className={`h-6 ${w} animate-pulse rounded-full bg-gray-200 dark:bg-white/[0.06]`} />
        ))}
      </div>

      {/* Task card skeletons */}
      {[0, 1, 2, 3].map((i) => (
        <SkeletonCard key={i} delay={i * 0.08} />
      ))}
    </div>
  );
}
