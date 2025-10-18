import { Info } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { WeightEstimate } from "@/hooks/useProductConfig";

interface WeightEstimatorProps {
  weightEstimate: WeightEstimate;
}

export default function WeightEstimator({ weightEstimate }: WeightEstimatorProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Greutate estimată</span>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button className="text-muted-foreground hover:text-foreground">
                    <Info className="h-4 w-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p className="text-xs">{weightEstimate.formula}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold">{weightEstimate.totalWeight.toFixed(2)}</span>
            <span className="text-lg text-muted-foreground">kg</span>
          </div>

          <div className="text-xs text-muted-foreground pt-2 border-t">
            Formula: {weightEstimate.formula}
          </div>

          {weightEstimate.unitWeight > 0 && (
            <div className="text-xs text-muted-foreground">
              Greutate specifică: {weightEstimate.unitWeight.toFixed(2)} kg/m
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
