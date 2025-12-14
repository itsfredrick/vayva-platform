import { Button, OpsShell } from '@vayva/ui';

export default function Home() {
  return (
    <OpsShell
      header={<span className="font-mono">OPS:MAIN</span>}
      sidebar={<div className="p-4 text-gray-400">Nav Placeholder</div>}
    >
      <h1 className="text-2xl font-bold mb-4">Internal Operations</h1>
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-[#222] p-4 rounded border border-[#333]">
           <div className="text-sm text-gray-400">Pending Approvals</div>
           <div className="text-2xl font-bold">12</div>
        </div>
      </div>
    </OpsShell>
  );
}
