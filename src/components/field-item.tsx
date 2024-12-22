import React, { useState } from "react";

import { FieldTypeIconWrapper } from "@/components/field-type-icon";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FieldSettings } from "@/components/field-settings";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { fieldTypes } from "@/static/field-types";

import { GripVertical, Settings, Square, Trash2 } from "lucide-react";

import { type Field } from "@/types/fields";
import { capitalize, cn } from "@/lib/utils";

const getUserFieldHTMLId = (fieldId: number, field: string) => {
  return `user-field-${fieldId}--${field}`;
};

export const FieldItem = React.memo(
  ({
    field,
    setLabel,
    setPlaceholder,
    setRequired,
    onRemove,
  }: {
    field: Field;
    setLabel: (label: string) => void;
    setPlaceholder: (placeholder: string) => void;
    setRequired: (required: boolean) => void;
    onRemove: (id: number) => void;
  }) => {
    const [fieldSettingsDialogOpen, setFieldSettingsDialogOpen] = useState(false);

    const fieldType = fieldTypes.find(
      (fieldType) => fieldType.type === field.type
    );

    const fieldTypeName = fieldType?.name || capitalize(field.type);

    return (
      <li className="rounded-lg overflow-hidden border border-zinc-200 text-zinc-950 shadow-sm flex gap-3">
        <div className="cursor-move flex justify-center items-center bg-gray-200 text-zinc-400 h-full w-4">
          <GripVertical />
        </div>
        <div className="h-full w-full pr-3 py-3 space-y-3">
          <div className="flex items-center gap-2">
            <FieldTypeIconWrapper
              icon={fieldType?.icon || Square}
              size={18}
              className={cn(fieldType?.className || "bg-gray-500", "h-8 w-8")}
            />
            <span className="font-medium">{fieldTypeName} field</span>
          </div>
          <div className="flex justify-between gap-1.5">
            <div className="space-y-1 w-full">
              <Label
                className="font-medium"
                htmlFor={getUserFieldHTMLId(field.id, "label")}
              >
                Label
              </Label>
              <Input
                onChange={(e) => setLabel(e.target.value)}
                value={field.label}
                id={getUserFieldHTMLId(field.id, "label")}
                placeholder="Label..."
              />
            </div>
            <div className="self-end flex gap-1.5">
              <Dialog open={fieldSettingsDialogOpen} onOpenChange={setFieldSettingsDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <Settings className="text-zinc-800" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>{fieldTypeName} field</DialogTitle>
                    <DialogDescription>
                      Make changes to your form field here. Click save when
                      you're done.
                    </DialogDescription>
                  </DialogHeader>
                  <FieldSettings
                    placeholder={field.placeholder}
                    onSave={(values) => {
                      setPlaceholder(values.placeholder);
                      setFieldSettingsDialogOpen(false);
                    }}
                  />
                </DialogContent>
              </Dialog>
              <Button onClick={() => onRemove(field.id)} variant="outline">
                <Trash2 className="text-zinc-800" />
              </Button>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Switch
              checked={field.required}
              onCheckedChange={(checked) => setRequired(checked)}
              id={getUserFieldHTMLId(field.id, "required")}
            />
            <Label htmlFor={getUserFieldHTMLId(field.id, "required")}>
              Required
            </Label>
          </div>
        </div>
      </li>
    );
  }
);
