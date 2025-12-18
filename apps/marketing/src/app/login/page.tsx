import { redirect } from 'next/navigation';

export default function LoginPage() {
    // Redirect to Merchant Admin Auth
    // In production this would be an env var, for now hardcoded to localhost:3000
    redirect('http://localhost:3000/signin');
}
