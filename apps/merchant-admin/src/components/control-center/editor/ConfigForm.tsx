import React from "react";
import { useFormContext } from "react-hook-form";
import { ConfigSchema } from "@/lib/templates-registry";
import { Input, Label, Switch } from "@vayva/ui";

interface ConfigFormProps {
    schema: ConfigSchema;
}

export const ConfigForm = ({ schema }: ConfigFormProps) => {
    const { register, watch, setValue } = useFormContext();

    return (
        <div className="space-y-8 p-4">
            {schema.sections.map((section) => (
                <div key={section.id} className="space-y-4">
                    <div className="border-b pb-2">
                        <h3 className="font-bold text-gray-900">{section.title}</h3>
                        {section.description && (
                            <p className="text-sm text-gray-500">{section.description}</p>
                        )}
                    </div>

                    <div className="space-y-4">
                        {section.fields.map((field) => {
                            const fieldName = `${field.key}`; // e.g. "primaryColor"

                            if (field.type === "color") {
                                return (
                                    <div key={field.key} className="flex flex-col gap-2">
                                        <Label>{field.label}</Label>
                                        <div className="flex gap-2 items-center">
                                            <div className="relative w-10 h-10 rounded-full overflow-hidden border shadow-sm">
                                                <input
                                                    type="color"
                                                    {...register(fieldName)}
                                                    className="absolute inset-0 w-[150%] h-[150%] -top-[25%] -left-[25%] p-0 cursor-pointer"
                                                />
                                            </div>
                                            <Input
                                                {...register(fieldName)}
                                                className="flex-1 font-mono text-sm max-w-[120px]"
                                            />
                                        </div>
                                    </div>
                                );
                            }

                            if (field.type === "boolean") {
                                return (
                                    <div key={field.key} className="flex items-center justify-between border p-3 rounded-lg bg-gray-50">
                                        <Label className="cursor-pointer" htmlFor={fieldName}>
                                            {field.label}
                                        </Label>
                                        <Switch
                                            id={fieldName}
                                            checked={watch(fieldName)}
                                            onCheckedChange={(checked) => setValue(fieldName, checked)}
                                        />
                                    </div>
                                );
                            }

                            if (field.type === "number") {
                                return (
                                    <div key={field.key} className="flex flex-col gap-2">
                                        <Label>{field.label}</Label>
                                        <Input
                                            type="number"
                                            {...register(fieldName, { valueAsNumber: true })}
                                        />
                                    </div>
                                )
                            }

                            return (
                                <div key={field.key} className="flex flex-col gap-2">
                                    <Label>{field.label}</Label>
                                    <Input {...register(fieldName)} />
                                    {field.helpText && (
                                        <p className="text-xs text-gray-500">{field.helpText}</p>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            ))}
        </div>
    );
};
