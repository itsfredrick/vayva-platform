"use client";

import React from "react";
import { ControlCenterShell } from "@/components/control-center/ControlCenterShell";
import { TemplateGallery } from "@/components/control-center/TemplateGallery";
import { toast } from "sonner";

export default function TemplatesPage() {
    const handleUseTemplate = (template: any) => {
        // Implement activation logic
        handleActivate(template.id);
    };

    const handleActivate = async (id: string) => {
        try {
            const res = await fetch("/api/templates", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ templateId: id }),
            });
            const data = await res.json();

            if (data.success) {
                toast.success("Store template activated!");
                window.location.reload(); // naive refresh
            } else {
                toast.error("Activation failed");
            }
        } catch (error) {
            toast.error("Error activating template");
        }
    };

    return (
        <ControlCenterShell>
            <div className="p-8">
                <TemplateGallery
                    currentPlan="growth" // Dynamic plan needed? Use "growth" for now or fetch
                    onUseTemplate={handleUseTemplate}
                    onPreview={() => { }} // Gallery handles preview internally? No, need to pass handler or let it handle. My refactor had checks.
                />
            </div>
        </ControlCenterShell>
    );
}
