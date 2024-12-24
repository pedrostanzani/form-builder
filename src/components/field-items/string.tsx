import React, { useState } from "react";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Settings, Square, Trash2 } from "lucide-react";

import { DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
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

import { StringField } from "@/types/fields";
import { fieldTypes } from "@/static/field-types";
import { cn, getUserFieldHTMLId } from "@/lib/utils";
import { FieldItemWrapper } from "../field-item-wrapper";

const formSchema = z.object({
  placeholder: z.string(),
  format: z.enum(["input", "textarea", "email", "password"]),
});

const StringFieldSettings = ({
  placeholder,
  format,
  onSave,
}: {
  placeholder?: string;
  format: "input" | "textarea" | "email" | "password";
  onSave: (values: z.infer<typeof formSchema>) => void;
}) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      placeholder: placeholder,
      format: format,
    },
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

          <FormField
            control={form.control}
            name="format"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Input format</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select an input format" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="input">Input</SelectItem>
                    <SelectItem value="textarea">Textarea</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="password">Password</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  Choose the format of the field: standard input, textarea,
                  email or password.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <DialogFooter>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </form>
      </Form>
    </>
  );
};

export const StringFieldItem = React.memo(
  ({
    id,
    field,
    setLabel,
    setRequired,
    onSaveSettings,
    onRemove,
  }: {
    id: number;
    field: StringField;
    setLabel: (label: string) => void;
    setRequired: (required: boolean) => void;
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
          <span className="font-medium">String field</span>
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
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>String field</DialogTitle>
                  <DialogDescription>
                    Make changes to your form field here. Click save when you're
                    done.
                  </DialogDescription>
                </DialogHeader>
                <StringFieldSettings
                  placeholder={field.placeholder}
                  format={field.format}
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
      </FieldItemWrapper>
    );
  }
);
