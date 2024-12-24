import React, { useState } from "react";

import { z } from "zod";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Settings, Square, Trash2 } from "lucide-react";

import { DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FieldTypeIconWrapper } from "@/components/field-type-icon";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { EnumField } from "@/types/fields";
import { fieldTypes } from "@/static/field-types";
import { cn, getUserFieldHTMLId } from "@/lib/utils";
import { FieldItemWrapper } from "../field-item-wrapper";

const formSchema = z.object({
  placeholder: z.string(),
  options: z.array(
    z.object({
      name: z.string().min(1),
      value: z.string().min(1),
    })
  ),
});

const EnumFieldSettings = ({
  placeholder,
  options,
  onSave,
}: {
  placeholder?: string;
  options?: { name: string; value: string }[];
  onSave: (values: z.infer<typeof formSchema>) => void;
}) => {
  const form = useForm<z.infer<typeof formSchema>>({
    mode: "onChange",
    resolver: zodResolver(formSchema),
    defaultValues: {
      placeholder: placeholder,
      options: options,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "options", // Corresponds to the "options" field in the schema
  });

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSave)} className="space-y-4">
          <FormField
            control={form.control}
            name="placeholder"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Placeholder</FormLabel>
                <FormControl>
                  <Input placeholder="Placeholder" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex flex-col gap-2">
            <FormLabel className="pb-1">Options</FormLabel>
            <ul className="space-y-2">
              {fields.map((field, index) => (
                <li key={field.id} className="flex items-center space-x-2">
                  <FormControl>
                    <Input
                      placeholder="Name"
                      {...form.register(`options.${index}.name`)}
                    />
                  </FormControl>
                  <FormControl>
                    <Input
                      placeholder="Value"
                      {...form.register(`options.${index}.value`)}
                    />
                  </FormControl>
                  <Button
                    type="button"
                    onClick={() => remove(index)}
                    variant="outline"
                  >
                    <Trash2 className="text-zinc-800" />
                  </Button>
                </li>
              ))}
            </ul>
            <Button
              type="button"
              onClick={() => append({ name: "", value: "" })}
              size="sm"
              className="self-start"
              variant="outline"
            >
              Add option
            </Button>
          </div>

          <DialogFooter>
            <Button disabled={!form.formState.isValid} type="submit">Save changes</Button>
          </DialogFooter>
        </form>
      </Form>
    </>
  );
};

export const EnumFieldItem = React.memo(
  ({
    id,
    field,
    setLabel,
    onSaveSettings,
    onRemove,
  }: {
    id: number;
    field: EnumField;
    setLabel: (label: string) => void;
    onSaveSettings: (values: z.infer<typeof formSchema>) => void;
    onRemove: (id: number) => void;
  }) => {
    const [fieldSettingsDialogOpen, setFieldSettingsDialogOpen] =
      useState(false);

    const fieldType = fieldTypes.find(
      (fieldType) => fieldType.type === field.type
    );

    return (
      <FieldItemWrapper id={id}>
        <div className="flex items-center gap-2">
          <FieldTypeIconWrapper
            icon={fieldType?.icon || Square}
            size={18}
            className={cn(fieldType?.className || "bg-gray-500", "h-8 w-8")}
          />
          <span className="font-medium">Enum field</span>
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
            <Dialog
              open={fieldSettingsDialogOpen}
              onOpenChange={setFieldSettingsDialogOpen}
            >
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Settings className="text-zinc-800" />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-h-[625px] overflow-y-scroll sm:max-w-[525px]">
                <DialogHeader>
                  <DialogTitle>Enum field</DialogTitle>
                  <DialogDescription>
                    Make changes to your form field here. Click save when you're
                    done.
                  </DialogDescription>
                </DialogHeader>
                <EnumFieldSettings
                  options={field.options}
                  placeholder={field.placeholder}
                  onSave={(values) => {
                    onSaveSettings(values);
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
        {/* <div className="flex items-center gap-2">
            <Switch
              checked={field.required}
              onCheckedChange={(checked) => setRequired(checked)}
              id={getUserFieldHTMLId(field.id, "required")}
            />
            <Label htmlFor={getUserFieldHTMLId(field.id, "required")}>
              Required
            </Label>
          </div> */}
      </FieldItemWrapper>
    );
  }
);
