"use client";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FieldTypeIconWrapper } from "@/components/fields/icon-wrapper";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { cn, getMaxId } from "@/lib/utils";

import {
  FieldType,
  Field,
  FieldWithoutId,
} from "@/types/fields";
import { fieldTypes } from "@/constants/field-types";

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
import { MetaFieldItem } from "./fields/items/meta";
import { FormPreview } from "./preview";
import { InitialData } from "@/types/initial-data";
import { SubmitButtonFieldItem } from "./fields/items/submit";
import { GenericFieldItem } from "./fields/items/generic";

export function FormBuilder({ initialData }: { initialData: InitialData }) {
  const [nextFieldId, setNextFieldId] = useState(
    initialData.fields.length === 0 ? 0 : getMaxId(initialData.fields) + 1
  );
  const [currentTab, setCurrentTab] = useState<"form" | "code">("form");
  const [metadataIsCollapsed, setMetadataIsCollapsed] = useState(true);
  const [submitButtonCardIsCollapsed, setSubmitButtonCardIsCollapsed] =
    useState(true);
  const [anEnumHasBeenAdded, setAnEnumHasBeenAdded] = useState(false);
  const [addFieldDialogOpen, setAddFieldDialogOpen] = useState(false);
  const [fields, setFields] = useState<Field[]>(initialData.fields);
  const [metadata, setMetadata] = useState<{
    title: string;
    description: string;
    submitText: string;
  }>(initialData.metadata);

  const [formValues, setFormValues] = useState<Record<string, any>>({});

  const appendField = (field: FieldWithoutId) => {
    setFields([...fields, { id: nextFieldId, ...field }]);
    if (nextFieldId === 1) {
      setMetadataIsCollapsed(false);
    }
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
        placeholder: "Select an option from the enum...",
        options: anEnumHasBeenAdded
          ? []
          : [
              { name: "Apple", value: "apple" },
              { name: "Banana", value: "banana" },
              { name: "Orange", value: "orange" },
            ],
      });
      setAnEnumHasBeenAdded(true);
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
    <main className="flex sm:flex-row flex-col flex-1 pt-4 px-4 gap-4 pb-4">
      <div className="w-full sm:w-1/2">
        <div className="mb-3 h-10 flex items-center">
          <h2 className="text-2xl font-bold tracking-tight">Form fields</h2>
        </div>
        {/* <pre className="text-xs mb-3">{JSON.stringify(fields, null, 2)}</pre> */}
        <div className={cn("grid", fields.length === 0 ? "gap-2" : "gap-3")}>
          <MetaFieldItem
            hideFields={metadataIsCollapsed}
            setHideFields={setMetadataIsCollapsed}
            title={metadata.title}
            setTitle={(newTitle) =>
              setMetadata((prev) => ({ ...prev, title: newTitle }))
            }
            description={metadata.description}
            setDescription={(newDescription) =>
              setMetadata((prev) => ({ ...prev, description: newDescription }))
            }
          />
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={fields.map((field) => field.id)}
              strategy={verticalListSortingStrategy}
            >
              <ol className={cn("grid gap-3")}>
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
          <SubmitButtonFieldItem
            hideFields={submitButtonCardIsCollapsed}
            setHideFields={setSubmitButtonCardIsCollapsed}
            submitText={metadata.submitText}
            setSubmitText={(newSubmitText) =>
              setMetadata((prev) => ({ ...prev, submitText: newSubmitText }))
            }
          />
        </div>
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
      <div className="w-full sm:w-1/2">
        <div className="flex justify-between mb-3 items-center">
          <h2 className="text-2xl font-bold tracking-tight">Preview</h2>
          <Tabs
            defaultValue="form"
            value={currentTab}
            onValueChange={setCurrentTab as (value: string) => void}
          >
            <TabsList>
              <TabsTrigger value="form">Form</TabsTrigger>
              <TabsTrigger value="code">Code</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        <FormPreview
          key={nextFieldId}
          fields={fields}
          currentTab={currentTab}
          metadata={metadata}
          formValues={formValues}
          setFormValues={setFormValues}
          nextFieldId={nextFieldId}
        />
      </div>
    </main>
  );
}
