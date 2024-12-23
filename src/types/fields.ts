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

export type EnumField = {
  id: number;
  type: "enum";
  format: "select" | "combobox" | "radio";
  label?: string;
  placeholder?: string;
}

export type Field = StringField | NumberField | EnumField

export type FieldWithoutId = Omit<StringField, "id"> | Omit<NumberField, "id"> | Omit<EnumField, "id">;

