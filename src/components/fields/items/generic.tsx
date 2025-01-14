import { EnumField, Field, StringField } from "@/types/fields";
import { SetStateAction } from "react";
import { StringFieldItem } from "./string";
import { EnumFieldItem } from "./enum";

export const GenericFieldItem = ({
  field,
  setFields,
  removeField,
}: {
  field: Field;
  setFields: (value: SetStateAction<Field[]>) => void;
  removeField: (fieldId: number) => void;
}) => {
  if (field.type === "string") {
    return (
      <StringFieldItem
        id={field.id}
        field={field}
        setLabel={(newLabel) =>
          setFields((prev) =>
            prev.map((f) => (f.id === field.id ? { ...f, label: newLabel } : f))
          )
        }
        setRequired={(newRequired) =>
          setFields((prev) =>
            prev.map((f) =>
              f.id === field.id ? { ...f, required: newRequired } : f
            )
          )
        }
        onSaveSettings={(values) => {
          setFields((prev) =>
            prev.map((f) =>
              f.id === field.id
                ? ({
                    ...f,
                    placeholder: values.placeholder,
                    format: values.format,
                  } as StringField)
                : f
            )
          );
        }}
        onRemove={() => removeField(field.id)}
      />
    );
  }

  if (field.type === "enum") {
    return (
      <EnumFieldItem
        id={field.id}
        field={field}
        setLabel={(newLabel) =>
          setFields((prev) =>
            prev.map((f) => (f.id === field.id ? { ...f, label: newLabel } : f))
          )
        }
        onSaveSettings={(values) => {
          setFields((prev) =>
            prev.map((f) =>
              f.id === field.id
                ? ({
                    ...f,
                    placeholder: values.placeholder,
                    options: values.options,
                    format: values.format,
                  } as EnumField)
                : f
            )
          );
        }}
        onRemove={() => removeField(field.id)}
      />
    );
  }

  return null;
};
