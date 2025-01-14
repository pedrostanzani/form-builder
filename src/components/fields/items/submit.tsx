import { cn } from "@/lib/utils";
import { Command, Eye, EyeOff, Heading1 } from "lucide-react";
import { FieldTypeIconWrapper } from "../icon-wrapper";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "../../ui/button";
import { Dispatch, SetStateAction } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useIsMounted } from "@/hooks/use-is-mounted";

export function SubmitButtonFieldItem({
  hideFields,
  setHideFields,
  submitText,
  setSubmitText
}: {
  hideFields: boolean;
  setHideFields: Dispatch<SetStateAction<boolean>>;
  submitText: string;
  setSubmitText: (s: string) => void;
}) {
  const isMounted = useIsMounted();

  return (
    <div className="rounded-lg mb-4 bg-white overflow-hidden border border-zinc-200 text-zinc-950 shadow-sm flex gap-3">
      <div className="flex justify-center items-center bg-gray-200 text-zinc-400 h-full w-4" />
      <div className="h-full flex flex-col w-full pr-3 py-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <FieldTypeIconWrapper
              icon={Command}
              size={18}
              className={cn("bg-gray-500", "h-8 w-8")}
            />
            <span className="font-medium">Submit button</span>
          </div>
          <div>
            <Button
              onClick={() => setHideFields((prev) => !prev)}
              variant="outline"
            >
              {hideFields ? (
                <Eye className="text-zinc-800" />
              ) : (
                <EyeOff className="text-zinc-800" />
              )}
            </Button>
          </div>
        </div>
        <AnimatePresence>
          {!hideFields && (
            <motion.div
              key="meta-fields"
              initial={isMounted() ? { height: 0, opacity: 0 } : false}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2, type: "tween" }}
              className="grid gap-3.5"
            >
              <div className="pt-3 space-y-1 w-full">
                <Label
                  className="font-medium"
                  htmlFor="user-field-metadata--form-title"
                >
                  Submit button text
                </Label>
                <Input
                  onChange={(e) => setSubmitText(e.target.value)}
                  value={submitText}
                  id="user-field-metadata--form-submit-text"
                  placeholder="Submit"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
