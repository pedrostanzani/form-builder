"use client";
import { Card } from "@/components/ui/card";
import { LivePreview } from "./live-preview";

import { cn } from "@/lib/utils";
import { SourceCodePreview } from "./source-code";
import { generateFieldKey } from "@/lib/utils";
import { EnumField, Field, StringField } from "@/types/fields";
import { z } from "zod";

const parseStringField = (field: StringField) => {
  if (field.format === "email") {
    return {
      schema: field.required
        ? z.string().email()
        : z.string().email().optional(),
      source: field.required
        ? `z.string().email()`
        : `z.string().email().optional()`,
      defaultValue: "",
    };
  }

  return {
    schema: field.required ? z.string() : z.string().optional(),
    source: field.required ? `z.string()` : `z.string().optional()`,
    defaultValue: "",
  };
};

const parseEnumField = (field: EnumField) => {
  return {
    schema: z.string(),
    source: `z.string()`,
    defaultValue: "",
  };
};

const parseFields = (fields: Field[]) => {
  const schemaSourceKeys: string[] = [];
  const schemaShape: Record<string, z.ZodTypeAny> = {};
  const defaultValues: Record<string, any> = {};

  fields.forEach((field) => {
    if (field.type === "string") {
      const { schema, source, defaultValue } = parseStringField(field);
      const key = generateFieldKey(field.id);
      schemaShape[key] = schema;
      defaultValues[key] = defaultValue;
      schemaSourceKeys.push(`${key}: ${source}`);
    }

    if (field.type === "enum") {
      const { schema, source, defaultValue } = parseEnumField(field);
      const key = generateFieldKey(field.id);
      schemaShape[key] = schema;
      defaultValues[key] = defaultValue;
      schemaSourceKeys.push(`${key}: ${source}`);
    }
  });

  const schemaSource = `const formSchema = z.object({\n  ${schemaSourceKeys.join(
    ",\n  "
  )}\n})`;

  return {
    formSchema: z.object(schemaShape),
    defaultValues,
    schemaSource: schemaSource,
  };
};

export function FormPreview({
  fields,
  currentTab,
  metadata,
  formValues,
  setFormValues,
  nextFieldId,
}: {
  fields: Field[];
  currentTab: "form" | "code";
  metadata: {
    title: string;
    description: string;
  };
  formValues: Record<string, any>;
  setFormValues: (vals: Record<string, any>) => void;
  nextFieldId: number;
}) {
  const { formSchema, defaultValues, schemaSource } = parseFields(fields);

  return (
    <>
      <Card
        className={cn(
          "px-4 min-h-96 flex-1",
          fields.length !== 0
            ? "px-5 py-4"
            : "flex justify-center items-center text-center",
          currentTab !== "form" && "hidden"
        )}
      >
        {fields.length !== 0 ? (
          <LivePreview
            key={nextFieldId}
            formSchema={formSchema}
            defaultValues={defaultValues}
            fields={fields}
            metadata={metadata}
            formValues={formValues}
            setFormValues={setFormValues}
          />
        ) : (
          <p className="text-zinc-500 text-sm max-w-72">
            Add fields to the form to get started and then visualize the form
            preview.
          </p>
        )}
      </Card>
      <SourceCodePreview
        className={cn(currentTab === "form" && "hidden")}
        metadata={metadata}
        fields={fields}
        schemaCode={schemaSource}
      />
    </>
  );
}
