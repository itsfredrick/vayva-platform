
// Simple in-memory mock storage for demo purposes
// In a real app, this would be a database connection

let mockStorePolicies: any = {
    returnsMarkdown: "## Returns Policy\n\nWe accept returns within 30 days of purchase.",
    shippingMarkdown: "## Shipping Policy\n\nOrders are shipped within 2-3 business days.",
    privacyMarkdown: "", // Empty to test defaults
    termsMarkdown: "",   // Empty to test defaults
    policyContact: {
        email: "support@vayva.shop",
        phone: "+234 800 000 0000",
        whatsapp: "https://wa.me/2348000000000",
        address: "123 Lagos Street, Victoria Island, Lagos",
        businessHours: "Mon-Fri: 9AM - 5PM"
    }
};

export const getMockPolicies = () => mockStorePolicies;
export const updateMockPolicies = (data: any) => {
    mockStorePolicies = { ...mockStorePolicies, ...data };
    return mockStorePolicies;
};
