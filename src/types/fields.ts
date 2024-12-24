export type FieldType = "string" | "number" | "boolean" | "date" | "enum";

export type StringField = {
  id: number;
  type: "string";
  format: "input" | "textarea" | "email" | "password";
  label?: string;
  placeholder?: string;
  required: boolean;
};

export type NumberField = {
  id: number;
  type: "number";
};

export type EnumField = {
  id: number;
  type: "enum";
  format: "select" | "combobox" | "radio";
  label?: string;
  placeholder?: string;
  options: {
    name: string;
    value: string;
  }[];
};

export type Field = StringField | NumberField | EnumField;

export type FieldWithoutId =
  | Omit<StringField, "id">
  | Omit<NumberField, "id">
  | Omit<EnumField, "id">;

import z from "zod";

export const initialFieldsSchema = z.object({
  metadata: z.object({
    title: z.string(),
    description: z.string(),
  }),
  fields: z.array(
    // String field
    z.union([
      z.object({
        type: z.literal("string"),
        format: z.union([
          z.literal("input"),
          z.literal("textarea"),
          z.literal("email"),
          z.literal("password"),
        ]),
        label: z.string().optional(),
        placeholder: z.string().optional(),
        required: z.boolean(),
      }),

      // Enum field
      z.object({
        type: z.literal("enum"),
        format: z.union([
          z.literal("select"),
          z.literal("combobox"),
          z.literal("radio"),
        ]),
        label: z.string().optional(),
        placeholder: z.string().optional(),
        options: z.array(
          z.object({
            name: z.string(),
            value: z.string(),
          })
        ),
      }),
    ])
  ),
});
