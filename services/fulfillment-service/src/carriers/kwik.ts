
import axios from 'axios';
import { ICarrierProvider, CreateJobParams, JobResult, WebhookResult } from './types';

export class KwikProvider implements ICarrierProvider {
    private apiKey: string;
    private baseUrl: string;

    constructor(apiKey: string, isSandbox: boolean = false) {
        this.apiKey = apiKey;
        this.baseUrl = isSandbox ? 'https://api.sandbox.kwik.delivery' : 'https://api.kwik.delivery';
    }

    async createJob(params: CreateJobParams): Promise<JobResult> {
        // Implement real HTTP call here later. Mocking for V1.
        console.log('KWIK: Creating job', params);

        // Mock Response
        return {
            providerJobId: `kwik_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
            status: 'CREATED',
            trackingUrl: `https://kwik.delivery/track/mock/${Date.now()}`,
            trackingCode: `KW-${Math.floor(Math.random() * 10000)}`
        };
    }

    async cancelJob(providerJobId: string): Promise<boolean> {
        console.log('KWIK: Cancelling job', providerJobId);
        return true;
    }

    async getJob(providerJobId: string): Promise<JobResult> {
        return {
            providerJobId,
            status: 'IN_TRANSIT', // Mock status
            trackingUrl: '...'
        };
    }
}
