
import { pipeline } from '@xenova/transformers';

async function test() {
    console.log("Starting embedding test...");
    try {
        const extractor = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
        console.log("Pipeline loaded.");
        const output = await extractor('This is a test sentence.', { pooling: 'mean', normalize: true });
        console.log("Embedding generated:", output.data.length);
    } catch (e) {
        console.error("Embedding Error:", e);
    }
}

test();
