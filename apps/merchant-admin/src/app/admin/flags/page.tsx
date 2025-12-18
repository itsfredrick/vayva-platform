
import { prisma } from '@vayva/db';
import { FlagList } from './components/FlagList';

export default async function FlagsPage() {
    const flags = await prisma.featureFlag.findMany({
        orderBy: { key: 'asc' }
    });

    return (
        <div className="max-w-5xl mx-auto p-8">
            <FlagList flags={flags} />
        </div>
    );
}
