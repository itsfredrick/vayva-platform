"use client";

import { Button, Input, Modal, Label, Textarea } from "@vayva/ui";
import { FolderPlus, Loader2, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Project, ProjectCard } from "@/components/portfolio/ProjectCard";
import { useRouter } from "next/navigation";

export default function PortfolioPage() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [newTitle, setNewTitle] = useState("");
    const [newDesc, setNewDesc] = useState("");
    const [isCreating, setIsCreating] = useState(false);
    const router = useRouter();

    const fetchProjects = async () => {
        setIsLoading(true);
        try {
            const res = await fetch("/api/portfolio");
            const data = await res.json();
            if (data.projects) setProjects(data.projects);
        } catch (e) {
            toast.error("Failed to load projects");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    const createProject = async () => {
        if (!newTitle) return;
        setIsCreating(true);
        try {
            const res = await fetch("/api/portfolio", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title: newTitle, description: newDesc })
            });
            const data = await res.json();
            if (data.project) {
                toast.success("Project created");
                setIsCreateOpen(false);
                setNewTitle("");
                setNewDesc("");
                router.push(`/dashboard/portfolio/${data.project.id}`); // Jump to editor
            }
        } catch (e) {
            toast.error("Failed to create project");
        } finally {
            setIsCreating(false);
        }
    };

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900">Portfolio</h1>
                    <p className="text-gray-500">Manage your creative projects and client galleries.</p>
                </div>
                <Button onClick={() => setIsCreateOpen(true)} className="bg-black text-white hover:bg-gray-800">
                    <FolderPlus className="mr-2 h-4 w-4" /> New Project
                </Button>
            </div>

            {/* Content */}
            {isLoading ? (
                <div className="flex justify-center py-12"><Loader2 className="animate-spin text-gray-400" /></div>
            ) : projects.length === 0 ? (
                <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-xl py-24 bg-gray-50/50">
                    <div className="bg-white p-4 rounded-full shadow-sm mb-4">
                        <FolderPlus className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">No Projects Yet</h3>
                    <p className="text-gray-500 mb-6 max-w-md text-center">Create your first project to start showcasing your work or sharing proofs with clients.</p>
                    <Button onClick={() => setIsCreateOpen(true)} variant="outline">Create Project</Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {projects.map(project => (
                        <ProjectCard key={project.id} project={project} />
                    ))}
                </div>
            )}

            {/* Create Modal */}
            <Modal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} title="New Project">
                <div className="space-y-4 py-4">
                    <div>
                        <Label htmlFor="title">Project Title</Label>
                        <Input
                            id="title"
                            placeholder="e.g. Summer Campaign 2024"
                            value={newTitle}
                            onChange={(e) => setNewTitle(e.target.value)}
                        />
                    </div>
                    <div>
                        <Label htmlFor="desc">Description (Optional)</Label>
                        <Textarea
                            id="desc"
                            placeholder="Brief details about this project..."
                            value={newDesc}
                            onChange={(e) => setNewDesc(e.target.value)}
                        />
                    </div>
                    <div className="flex justify-end pt-2">
                        <Button onClick={createProject} disabled={!newTitle || isCreating}>
                            {isCreating ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : null}
                            Create Project
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
