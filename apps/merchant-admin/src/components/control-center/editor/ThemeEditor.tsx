"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, FormProvider } from "react-hook-form";
import { Button, Icon } from "@vayva/ui";
import { NormalizedTemplate } from "@/lib/templates-registry";
import { ConfigForm } from "./ConfigForm";
import { toast } from "sonner";

interface ThemeEditorProps {
    template: NormalizedTemplate;
    initialConfig?: any;
    onSave: (config: any) => Promise<void>;
}

export const ThemeEditor = ({
    template,
    initialConfig,
    onSave,
}: ThemeEditorProps) => {
    const router = useRouter();
    const [isSaving, setIsSaving] = useState(false);
    const [activeDevice, setActiveDevice] = useState<"desktop" | "mobile">("desktop");

    // Flatten default values from schema if initialConfig is missing
    const defaultValues = initialConfig || template.configSchema?.sections.reduce((acc, section) => {
        section.fields.forEach(field => {
            acc[field.key] = field.defaultValue;
        });
        return acc;
    }, {} as any);

    const methods = useForm({
        defaultValues,
    });

    const onSubmit = async (data: any) => {
        setIsSaving(true);
        try {
            await onSave(data);
            toast.success("Theme changes saved!");
        } catch (error) {
            toast.error("Failed to save changes.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-gray-100 flex flex-col">
            {/* Header */}
            <header className="h-16 bg-white border-b px-6 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => router.back()}>
                        <Icon name="ArrowLeft" size={20} />
                    </Button>
                    <div>
                        <h1 className="font-bold text-gray-900">Customizing: {template.name}</h1>
                        <span className="text-xs text-gray-500">
                            {methods.formState.isDirty ? "Unsaved changes" : "All changes saved"}
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-lg">
                    <button
                        onClick={() => setActiveDevice("desktop")}
                        className={`p-2 rounded-md transition-all ${activeDevice === "desktop" ? "bg-white shadow-sm text-black" : "text-gray-500 hover:text-black"}`}
                    >
                        <Icon name="Monitor" size={18} />
                    </button>
                    <button
                        onClick={() => setActiveDevice("mobile")}
                        className={`p-2 rounded-md transition-all ${activeDevice === "mobile" ? "bg-white shadow-sm text-black" : "text-gray-500 hover:text-black"}`}
                    >
                        <Icon name="Smartphone" size={18} />
                    </button>
                </div>

                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => methods.reset()}>Reset</Button>
                    <Button
                        onClick={methods.handleSubmit(onSubmit)}
                        disabled={isSaving || !methods.formState.isDirty}
                        className="bg-black text-white hover:bg-gray-800"
                    >
                        {isSaving ? "Saving..." : "Save Changes"}
                    </Button>
                </div>
            </header>

            {/* Main Content */}
            <div className="flex-1 flex overflow-hidden">
                {/* Left: Editor Panel */}
                <aside className="w-[400px] bg-white border-r overflow-y-auto shrink-0 flex flex-col">
                    {template.configSchema ? (
                        <FormProvider {...methods}>
                            <ConfigForm schema={template.configSchema} />
                        </FormProvider>
                    ) : (
                        <div className="p-8 text-center text-gray-500">
                            <p>This template does not support deep customization yet.</p>
                        </div>
                    )}
                </aside>

                {/* Right: Preview Panel */}
                <main className="flex-1 bg-gray-100 relative flex items-center justify-center p-8 overflow-hidden">
                    {/* 
               TODO: Connect to TemplateModal's Iframe or Replicate it here.
               For MVP we will just show a placeholder or basic iframe 
            */}
                    <div
                        className={`transition-all duration-500 bg-white shadow-2xl overflow-hidden border border-gray-200
                    ${activeDevice === "mobile" ? "w-[375px] h-[667px] rounded-3xl" : "w-full h-full rounded-md"}
                `}
                    >
                        <iframe
                            src={`${template.previewRoute}?config=${encodeURIComponent(JSON.stringify(methods.watch()))}`}
                            className="w-full h-full border-none"
                        />
                    </div>
                </main>
            </div>
        </div>
    );
};
