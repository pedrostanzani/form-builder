import { cn } from "@/lib/utils";
import { Eye, EyeOff, Heading1 } from "lucide-react";
import { FieldTypeIconWrapper } from "../field-type-icon";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { Dispatch, SetStateAction } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useIsMounted } from "@/hooks/use-is-mounted";

export function MetaFieldItem({
  hideFields,
  setHideFields,
  title,
  setTitle,
  description,
  setDescription,
}: {
  hideFields: boolean;
  setHideFields: Dispatch<SetStateAction<boolean>>;
  title: string;
  setTitle: (s: string) => void;
  description: string;
  setDescription: (s: string) => void;
}) {
  const isMounted = useIsMounted();

  return (
    <div className="rounded-lg bg-white overflow-hidden border border-zinc-200 text-zinc-950 shadow-sm flex gap-3">
      <div className="flex justify-center items-center bg-gray-200 text-zinc-400 h-full w-4" />
      <div className="h-full flex flex-col w-full pr-3 py-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <FieldTypeIconWrapper
              icon={Heading1}
              size={18}
              className={cn("bg-gray-500", "h-8 w-8")}
            />
            <span className="font-medium">Metadata</span>
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
                  Form title
                </Label>
                <Input
                  onChange={(e) => setTitle(e.target.value)}
                  value={title}
                  id="user-field-metadata--form-title"
                  placeholder="My New Form"
                />
              </div>
              <div className="space-y-1 w-full">
                <Label
                  className="font-medium"
                  htmlFor="user-field-metadata--form-description"
                >
                  Form description
                </Label>
                <Textarea
                  onChange={(e) => setDescription(e.target.value)}
                  value={description}
                  id="user-field-metadata--form-description"
                  placeholder="I built this form with shadcn/ui, React Hook Form and Zod..."
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
