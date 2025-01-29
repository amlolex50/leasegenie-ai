import { Progress } from "@/components/ui/progress";

interface ProcessingProgressProps {
  progress: number;
}

export const ProcessingProgress = ({ progress }: ProcessingProgressProps) => {
  return (
    <div className="space-y-2">
      <Progress value={progress} className="w-full" />
      <p className="text-sm text-muted-foreground">
        Processing document... {progress}%
      </p>
    </div>
  );
};