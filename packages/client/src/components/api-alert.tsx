import { useAtom } from "jotai";
import { apiKeyAtom, showApiKeyAlertAtom } from "@/lib/store";
import { ArrowRight, TriangleAlert } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Input } from "./ui/input";

export default function ApiKeyAlert() {
  const [isEditing, setIsEditing] = useState(false);
  const [apiKey, setApiKey] = useAtom(apiKeyAtom);
  const [showAlert] = useAtom(showApiKeyAlertAtom);
  const [inputValue, setInputValue] = useState("");

  const handleStartEditing = () => {
    setInputValue(apiKey);
    setIsEditing(true);
  };

  function handleAPIKeySave() {
    if (!inputValue.trim()) {
      toast.error("Please enter a valid API key");
      return;
    }

    setApiKey(inputValue); // 只在点击保存时更新 atom
    setIsEditing(false);
    toast.success("API Key saved successfully");
  }

  if (!showAlert) return null;

  return (
    <div className="flex gap-3">
      <div className="flex grow justify-between gap-3">
        {!isEditing && (
          <>
            <TriangleAlert
              className="shrink-0 mt-0.5 text-amber-500"
              size={16}
              strokeWidth={2}
              aria-hidden="true"
            />
            <p className="text-sm">
              Please enter your OpenAI API key to proceed.{" "}
            </p>
          </>
        )}

        <div className="group whitespace-nowrap text-sm font-medium">
          {!isEditing ? (
            <ArrowRight
              className="-mt-0.5 ms-1 inline-flex opacity-60 transition-transform group-hover:translate-x-0.5 cursor-pointer"
              size={16}
              strokeWidth={2}
              aria-hidden="true"
              onClick={handleStartEditing}
            />
          ) : (
            <div className="flex items-center gap-2">
              <Input
                className="h-8 w-48"
                placeholder="sk-xxxxxxxxxx"
                type="password"
                value={inputValue}
                onChange={(event) => setInputValue(event.target.value)}
              />
              <button
                onClick={handleAPIKeySave}
                className="h-8 px-3 text-sm font-medium rounded-lg border border-input bg-background hover:bg-accent hover:text-foreground transition-colors"
              >
                Save
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
