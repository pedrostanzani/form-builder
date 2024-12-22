export type FieldType = "string" | "number" | "boolean" | "date" | "enum";


type StringField = {
  id: number;
  type: "string";
  label?: string;
  placeholder?: string;
  required: boolean;
}

export type Field = StringField
