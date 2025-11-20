'use client';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  return (
    <div style={{ textAlign: 'center', padding: '10px' }}>
      <p>Could not fetch the list of notes. {error.message}</p>
      <button onClick={() => reset()}>Try again</button>
    </div>
  );
}
