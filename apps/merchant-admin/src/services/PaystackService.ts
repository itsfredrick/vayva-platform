
const PAYSTACK_BASE_URL = 'https://api.paystack.co';
const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY || 'sk_test_mock_key'; // Fallback for dev

export class PaystackService {

    /**
     * Initialize a transaction
     */
    static async initializeTransaction(email: string, amount: number, reference: string, callbackUrl: string) {
        // Amount is in Kobo
        const response = await fetch(`${PAYSTACK_BASE_URL}/transaction/initialize`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email,
                amount,
                reference,
                callback_url: callbackUrl
            })
        });

        if (!response.ok) {
            // Check if it's a mock environment issue, otherwise throw
            if (PAYSTACK_SECRET_KEY === 'sk_test_mock_key') {
                return {
                    authorization_url: `http://localhost:3000/mock-checkout?reference=${reference}&amount=${amount}`,
                    access_code: 'mock_code',
                    reference
                };
            }
            const error = await response.json();
            throw new Error(error.message || 'Paystack initialization failed');
        }

        const data = await response.json();
        return data.data; // { authorization_url, access_code, reference }
    }

    /**
     * Verify a transaction
     */
    static async verifyTransaction(reference: string) {
        if (PAYSTACK_SECRET_KEY === 'sk_test_mock_key') {
            // Simulate success for mock
            return {
                status: 'success',
                amount: 10000, // Mock amount, caller should verify
                reference,
                customer: { email: 'mock@test.com' }
            };
        }

        const response = await fetch(`${PAYSTACK_BASE_URL}/transaction/verify/${reference}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`
            }
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Paystack verification failed');
        }

        const data = await response.json();
        return data.data;
    }
}
