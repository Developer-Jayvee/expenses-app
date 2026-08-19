import {
  Card,
  CardContent,
  CardHeader,
} from "@c/lib/shadcn/components/ui/card";
import { Skeleton } from "@c/lib/shadcn/components/ui/skeleton";

export default function DashboardSkeleton() {
  return (
    <div className="flex w-full flex-col gap-5 p-5">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-4 w-56" />
        </div>
        <Skeleton className="h-9 w-24" />
      </div>

      <div className="grid grid-cols-1 gap-3.5 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <Skeleton className="h-5 w-36" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-72 w-full" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <Skeleton className="h-5 w-36" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-72 w-full" />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-52" />
          <Skeleton className="h-4 w-40" />
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="flex items-center gap-4">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-5 w-20 rounded-full" />
              <Skeleton className="ml-auto h-4 w-20" />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
