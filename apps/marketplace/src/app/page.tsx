import { Button, StorefrontShell } from '@vayva/ui';

export default function Home() {
  return (
    <StorefrontShell
      header={<div className="font-bold text-xl text-purple-600">Vayva Market</div>}
      footer={<div className="text-center text-gray-500">Marketplace Footer</div>}
    >
      <div className="container mx-auto py-20">
        <h1 className="text-4xl font-bold mb-4">Global Marketplace</h1>
        <Button variant="secondary">Browse Categories</Button>
      </div>
    </StorefrontShell>
  );
}
