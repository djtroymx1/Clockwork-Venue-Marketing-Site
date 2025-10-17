import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Honeypot check
    if (body.honeypot) {
      // It's likely a bot, so we pretend it was successful but do nothing.
      return NextResponse.json({ message: 'Success' }, { status: 200 });
    }

    // Here you would typically send the data to your backend service,
    // like a Cloud Function, which then writes to Firestore or another database.
    // e.g., await fetch('https://your-cloud-function-url', { method: 'POST', body: JSON.stringify(body) });
    
    console.log('Waitlist submission received:', body);

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Return a success response
    return NextResponse.json({ message: 'Success' }, { status: 200 });

  } catch (error) {
    console.error('Waitlist submission error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
