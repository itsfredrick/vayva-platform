"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { useChat } from "@ai-sdk/react"
import { Calculator, CreditCard, LayoutDashboard, Settings, User, Bot, ArrowRight, Loader2 } from "lucide-react"

import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
    CommandShortcut,
} from "@/components/ui/command"
import { classifyIntent } from "@/app/actions/ai"

export function CommandPalette() {
    const [open, setOpen] = React.useState(false)
    const [query, setQuery] = React.useState("")
    const [mode, setMode] = React.useState<"NAV" | "CHAT">("NAV")
    const [isClassifying, setIsClassifying] = React.useState(false)
    const [intentLabel, setIntentLabel] = React.useState<string | null>(null)
    const [intentResult, setIntentResult] = React.useState<any | null>(null)

    const router = useRouter()

    // Vercel AI SDK for Chat Mode
    const { messages, input, handleInputChange, handleSubmit, setInput, isLoading: isChatLoading, stop } = useChat({
        api: "/api/ai/stream",
        onFinish: () => {
            // Optional: focus back on input?
        }
    } as any) as any

    // Toggle with Cmd+K
    React.useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault()
                setOpen((open) => !open)
            }
        }
        document.addEventListener("keydown", down)
        return () => document.removeEventListener("keydown", down)
    }, [])

    // Classification Logic (Debounced)
    React.useEffect(() => {
        if (mode === "CHAT") return // Don't classify while chatting
        if (!query) {
            setIntentLabel(null)
            setIntentResult(null)
            return
        }

        const timer = setTimeout(async () => {
            setIsClassifying(true)
            try {
                const result = await classifyIntent(query)
                setIntentResult(result) // Store result

                if (result.intent === "CHAT" && result.confidence > 0.8) {
                    setIntentLabel("✨ Ask AI Assistant")
                } else if (result.intent === "NAVIGATE") {
                    setIntentLabel(`Jump to ${result.payload.path}`)
                } else if (result.intent === "ACTION") {
                    setIntentLabel(`Action: ${result.payload.action}`)
                } else {
                    setIntentLabel(null)
                }
            } catch (e) {
                console.error(e)
            } finally {
                setIsClassifying(false)
            }
        }, 500)

        return () => clearTimeout(timer)
    }, [query, mode])

    const runCommand = React.useCallback((command: () => unknown) => {
        setOpen(false)
        command()
    }, [])

    const runAction = (action: string, params?: any) => {
        setOpen(false)
        console.log("Running action:", action, params)

        switch (action) {
            case "create_product":
                router.push("/dashboard/products/new")
                break
            case "view_orders":
                router.push("/dashboard/orders")
                break
            case "update_profile":
                router.push("/dashboard/settings/overview")
                break
            default:
                console.warn("Unknown action:", action)
                router.push("/dashboard")
        }
    }

    // Switch to Chat Mode
    const enterChatMode = () => {
        setMode("CHAT")
        setInput(query) // Transfer query to chat input
        // Ideally trigger submit immediately?
        // handleSubmit({ preventDefault: () => {} } as any) 
    }

    // Handle Input Change
    const onValueChange = (val: string) => {
        setQuery(val)
        if (mode === "CHAT") {
            handleInputChange({ target: { value: val } } as any)
        }
    }

    return (
        <CommandDialog open={open} onOpenChange={setOpen}>

            {/* Dynamic Header / Input */}
            <div className="flex items-center border-b px-3">
                {mode === "CHAT" ? <Bot className="mr-2 h-4 w-4 shrink-0 text-indigo-500 animate-pulse" /> : <Calculator className="mr-2 h-4 w-4 shrink-0 opacity-50" />}
                <input
                    className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder={mode === "CHAT" ? "Ask Vayva AI anything..." : "Type a command or search..."}
                    value={mode === "CHAT" ? input : query}
                    onChange={(e) => onValueChange(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && mode === "CHAT") {
                            handleSubmit(e as any)
                        }
                        if (e.key === "Enter" && mode === "NAV" && intentLabel === "✨ Ask AI Assistant") {
                            enterChatMode()
                        }
                    }}
                />
                {isClassifying && <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />}
            </div>

            <CommandList>
                {/* CHAT MODE VIEW */}
                {mode === "CHAT" && (
                    <div className="p-4 space-y-4">
                        {messages.length === 0 && <p className="text-sm text-muted-foreground">Go ahead, ask me about your store data or how to update settings.</p>}

                        {messages.map((m: any) => (
                            <div key={m.id} className={`flex gap-3 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`rounded-lg px-3 py-2 max-w-[80%] text-sm ${m.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-800'}`}>
                                    {m.content}
                                </div>
                            </div>
                        ))}

                        {isChatLoading && <div className="text-xs text-muted-foreground animate-pulse">Vayva AI is thinking...</div>}
                    </div>
                )}

                {/* NAV MODE VIEW */}
                {mode === "NAV" && (
                    <>
                        <CommandEmpty>No results found.</CommandEmpty>

                        {intentLabel && (
                            <CommandGroup heading="Suggested by AI">
                                <CommandItem onSelect={() => {
                                    if (!intentResult) return

                                    if (intentResult.intent === "CHAT") {
                                        enterChatMode()
                                    } else if (intentResult.intent === "ACTION") {
                                        runAction(intentResult.payload.action, intentResult.payload.params)
                                    } else if (intentResult.intent === "NAVIGATE") {
                                        router.push(intentResult.payload.path!)
                                        setOpen(false)
                                    }
                                }}>
                                    <Bot className="mr-2 h-4 w-4 text-indigo-500" />
                                    <span>{intentLabel}</span>
                                </CommandItem>
                            </CommandGroup>
                        )}

                        <CommandGroup heading="Suggestions">
                            <CommandItem onSelect={() => runCommand(() => router.push("/dashboard"))}>
                                <LayoutDashboard className="mr-2 h-4 w-4" />
                                <span>Dashboard</span>
                            </CommandItem>
                            <CommandItem onSelect={() => runCommand(() => router.push("/dashboard/products"))}>
                                <Calculator className="mr-2 h-4 w-4" />
                                <span>Products</span>
                            </CommandItem>
                            <CommandItem onSelect={() => runCommand(() => router.push("/dashboard/orders"))}>
                                <CreditCard className="mr-2 h-4 w-4" />
                                <span>Orders</span>
                            </CommandItem>
                        </CommandGroup>

                        <CommandSeparator />

                        <CommandGroup heading="Settings">
                            <CommandItem onSelect={() => runCommand(() => router.push("/dashboard/settings/overview"))}>
                                <User className="mr-2 h-4 w-4" />
                                <span>Profile</span>
                                <CommandShortcut>⌘P</CommandShortcut>
                            </CommandItem>
                            <CommandItem onSelect={() => runCommand(() => router.push("/dashboard/settings/billing"))}>
                                <CreditCard className="mr-2 h-4 w-4" />
                                <span>Billing</span>
                                <CommandShortcut>⌘B</CommandShortcut>
                            </CommandItem>
                            <CommandItem onSelect={() => runCommand(() => router.push("/dashboard/settings"))}>
                                <Settings className="mr-2 h-4 w-4" />
                                <span>Settings</span>
                                <CommandShortcut>⌘S</CommandShortcut>
                            </CommandItem>
                        </CommandGroup>
                    </>
                )}
            </CommandList>
        </CommandDialog>
    )
}
