"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Modal, Button, Icon } from "@vayva/ui";

const domainSchema = z.object({
    domain: z.string().min(1, "Domain is required").refine(
        (val) => /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/.test(val),
        "Please enter a valid domain name (e.g., example.com)"
    ),
});

type DomainFormValues = z.infer<typeof domainSchema>;

interface AddDomainModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (domain: string) => Promise<void>;
    isLoading: boolean;
}

export const AddDomainModal = ({
    isOpen,
    onClose,
    onAdd,
    isLoading,
}: AddDomainModalProps) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<DomainFormValues>({
        resolver: zodResolver(domainSchema),
    });

    const onSubmit = async (data: DomainFormValues) => {
        await onAdd(data.domain);
        reset();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Add Custom Domain">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pt-2">
                <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-700 uppercase tracking-widest">
                        Domain Name
                    </label>
                    <div className="relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                            <Icon name="Globe" size={16} />
                        </div>
                        <input
                            {...register("domain")}
                            className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:border-black focus:ring-0 transition-colors text-sm"
                            placeholder="myshop.com"
                            disabled={isLoading}
                        />
                    </div>
                    {errors.domain && (
                        <p className="text-xs text-red-500 font-medium">{errors.domain.message}</p>
                    )}
                    <p className="text-[10px] text-gray-400">
                        For example: <span className="font-mono">www.mysite.com</span> or <span className="font-mono">shop.example.org</span>
                    </p>
                </div>

                <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100/50 flex gap-3">
                    <Icon name="Info" className="text-blue-500 shrink-0" size={18} />
                    <p className="text-xs text-blue-700 leading-relaxed italic">
                        Once added, you will need to verify ownership by adding a TXT record to your DNS settings.
                    </p>
                </div>

                <div className="flex gap-3 pt-2">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onClose}
                        className="flex-1 rounded-xl h-11"
                        disabled={isLoading}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        className="flex-1 rounded-xl h-11 bg-black text-white hover:bg-gray-800"
                        disabled={isLoading}
                    >
                        {isLoading ? "Adding..." : "Add Domain"}
                    </Button>
                </div>
            </form>
        </Modal>
    );
};
