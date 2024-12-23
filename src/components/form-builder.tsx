"use client";
import { SetStateAction, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { StringFieldItem } from "@/components/field-items/string";
import { EnumFieldItem } from "@/components/field-items/enum";
import { FormPreview } from "@/components/form-preview";
import { FieldTypeIconWrapper } from "@/components/field-type-icon";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { cn } from "@/lib/utils";

import {
  FieldType,
  Field,
  StringField,
  FieldWithoutId,
} from "@/types/fields";
import { fieldTypes } from "@/static/field-types";

import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";

const GenericFieldItem = ({
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
        onRemove={() => removeField(field.id)}
      />
    );
  }

  return null;
};

export function FormBuilder() {
  const [nextFieldId, setNextFieldId] = useState(1);
  const [addFieldDialogOpen, setAddFieldDialogOpen] = useState(false);
  const [fields, setFields] = useState<Field[]>([]);

  const appendField = (field: FieldWithoutId) => {
    setFields([...fields, { id: nextFieldId, ...field }]);
    setNextFieldId((prev) => prev + 1);
  };

  const removeField = (fieldId: number) => {
    setFields(fields.filter((field) => field.id !== fieldId));
  };

  const handleAddField = (fieldType: FieldType) => {
    if (fieldType === "string") {
      appendField({
        type: "string",
        format: "input",
        label: "My string field",
        placeholder: "Insert placeholder here...",
        required: false,
      });
    }

    if (fieldType === "enum") {
      appendField({
        type: "enum",
        format: "select",
        label: "My enum field",
        placeholder: "Insert placeholder here...",
      });
    }

    setAddFieldDialogOpen(false);
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    if (over && active.id !== over.id) {
      setFields((fields) => {
        const oldIndex = fields.findIndex((field) => field.id === active.id);
        const newIndex = fields.findIndex((field) => field.id === over.id);
        return arrayMove(fields, oldIndex, newIndex);
      });
    }
  };

  return (
    <main className="flex flex-1 pt-4 px-4 gap-4">
      <div className="w-full">
        <h2 className="text-2xl font-bold tracking-tight mb-3">Form fields</h2>
        {/* <pre className="text-xs mb-3">{JSON.stringify(fields, null, 2)}</pre> */}
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={fields.map((field) => field.id)}
            strategy={verticalListSortingStrategy}
          >
            <ol className={cn("grid gap-3", fields.length > 0 && "mb-4")}>
              {fields.map((field) => (
                <GenericFieldItem
                  key={field.id}
                  field={field}
                  setFields={setFields}
                  removeField={removeField}
                />
              ))}
            </ol>
          </SortableContext>
        </DndContext>
        {fields.length !== 0 ? (
          <Button onClick={() => setAddFieldDialogOpen(true)}>Add field</Button>
        ) : (
          <Card className="p-4">
            <h3 className="text-lg font-bold tracking-tight">
              Getting started
            </h3>
            <p className="text-zinc-500 text-sm pb-3">
              Add a new field to get started.
            </p>
            <Button onClick={() => setAddFieldDialogOpen(true)}>
              Add field
            </Button>
          </Card>
        )}
        <Dialog open={addFieldDialogOpen} onOpenChange={setAddFieldDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader className="pb-0 mb-0">
              <DialogTitle className="">Add field</DialogTitle>
              <DialogDescription>
                What field would you like to add to the form?
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-2">
              {fieldTypes.map((fieldType) => (
                <button
                  onClick={() => handleAddField(fieldType.type)}
                  key={fieldType.id}
                  className="flex gap-2.5 hover:bg-zinc-100 transition-colors items-center p-2.5 rounded-lg border border-zinc-200 bg-white text-zinc-950 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50"
                >
                  <FieldTypeIconWrapper
                    className={fieldType.className}
                    icon={fieldType.icon}
                  />
                  <span className="tracking-tight">{fieldType.name}</span>
                </button>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <div className="w-full">
        <h2 className="text-2xl font-bold tracking-tight mb-3">Preview</h2>
        <Card
          className={cn(
            "px-4 min-h-96 flex-1",
            fields.length !== 0
              ? "px-5 py-4"
              : "flex justify-center items-center text-center"
          )}
        >
          {fields.length !== 0 ? (
            <FormPreview fields={fields} />
          ) : (
            <p className="text-zinc-500 text-sm max-w-72">
              Add fields to the form to get started and then visualize the form
              preview.
            </p>
          )}
        </Card>
      </div>
    </main>
  );
}
