import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="w-full h-full flex justify-center items-center space-x-2 text-neutral-500">
      <Loader2 className="w-4 h-4 animate-spin"></Loader2>
      <p>Loading...</p>
    </div>
  );
}
