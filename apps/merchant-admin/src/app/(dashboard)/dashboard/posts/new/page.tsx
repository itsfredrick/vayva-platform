
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Button, Input, Textarea, Label } from "@vayva/ui";
import { toast } from "sonner";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";

interface BlogPostFormProps {
    postId?: string;
    initialData?: any;
}

export default function BlogPostForm({ postId, initialData }: BlogPostFormProps) {
    const router = useRouter();
    const { register, handleSubmit, formState: { isSubmitting } } = useForm({
        defaultValues: initialData || {
            title: "",
            slug: "",
            excerpt: "",
            content: "",
            status: "DRAFT"
        }
    });

    const onSubmit = async (data: any) => {
        try {
            const endpoint = postId ? `/api/posts/${postId}` : "/api/posts/create";
            const method = postId ? "PATCH" : "POST";

            const res = await fetch(endpoint, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (!res.ok) throw new Error("Failed to save post");

            toast.success("Post saved successfully");
            router.refresh();
            if (!postId) router.push("/dashboard/posts");
        } catch (e) {
            toast.error("Something went wrong");
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard/posts">
                        <Button variant="ghost" size="icon"><ArrowLeft className="w-5 h-5" /></Button>
                    </Link>
                    <h1 className="text-2xl font-bold">{postId ? "Edit Post" : "New Post"}</h1>
                </div>
                <Button onClick={handleSubmit(onSubmit)} disabled={isSubmitting}>
                    <Save className="w-4 h-4 mr-2" />
                    {isSubmitting ? "Saving..." : "Save Post"}
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="space-y-2">
                        <Label>Title</Label>
                        <Input {...register("title", { required: true })} placeholder="Enter post title" />
                    </div>

                    <div className="space-y-2">
                        <Label>Content (Markdown)</Label>
                        <Textarea
                            {...register("content")}
                            className="min-h-[400px] font-mono text-sm"
                            placeholder="# Write your story here..."
                        />
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    <div className="bg-white p-4 rounded-lg border space-y-4">
                        <h3 className="font-semibold text-sm uppercase text-gray-500">Publishing</h3>
                        <div>
                            <Label>Slug</Label>
                            <Input {...register("slug")} placeholder="url-friendly-slug" />
                        </div>
                        <div>
                            <Label>Status</Label>
                            <select
                                {...register("status")}
                                className="w-full h-10 px-3 rounded-md border border-input bg-background"
                            >
                                <option value="DRAFT">Draft</option>
                                <option value="PUBLISHED">Published</option>
                            </select>
                        </div>
                    </div>

                    <div className="bg-white p-4 rounded-lg border space-y-4">
                        <h3 className="font-semibold text-sm uppercase text-gray-500">SEO</h3>
                        <div>
                            <Label>Excerpt</Label>
                            <Textarea {...register("excerpt")} className="h-20" placeholder="Brief summary..." />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
