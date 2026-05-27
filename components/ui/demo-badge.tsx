"use client";

import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export function DemoBadge() {
  return (
    <div className="fixed bottom-4 right-4 z-9999">
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="bg-yellow-400 hover:bg-yellow-500 transition-colors px-3 py-1 rounded-full shadow-lg border border-yellow-500 cursor-help">
            <p className="text-xs font-bold text-yellow-950">Demo Version</p>
          </div>
        </TooltipTrigger>
        <TooltipContent className="p-4 flex flex-col space-y-2" side="top" align="end">
          <div>
            <p className="font-bold text-center">Application running in demo mode</p>
          </div>
          <div>
            <p className="font-sm">For demonstration purposes authentication has been turned off and simplified</p>
            <p className="font-sm font-bold">Data is temporary and and will reset after 24 hours.</p>
          </div>
        </TooltipContent>
      </Tooltip>
    </div>
  );
}