export async function POST() {
    return new Response('Hello from the admin test route!', {
        status: 200,
        headers: {
            'Content-Type': 'text/plain',
        },
    });
}