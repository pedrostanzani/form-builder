export type FieldType = "string" | "number" | "boolean" | "date" | "enum";


export type StringField = {
  id: number;
  type: "string";
  format: "input" | "textarea" | "email" | "password";
  label?: string;
  placeholder?: string;
  required: boolean;
}

export type NumberField = {
  id: number;
  type: "number"
}

export type Field = StringField | NumberField

export type FieldWithoutId = Omit<StringField, "id"> | Omit<NumberField, "id">;

