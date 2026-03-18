export default function SupportPage() {
  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-display text-amber-900 mb-6">Support</h1>
      <div className="space-y-4 text-sm font-display text-amber-800">
        <p>
          Have a question, found a bug, or need help with your account? Send an email
          and we&rsquo;ll get back to you as soon as we can.
        </p>
        <a
          href="mailto:klogan4242@gmail.com"
          className="inline-block bg-amber-500 hover:bg-amber-600 text-white font-display text-sm px-6 py-3 rounded-xl transition-colors"
        >
          Email klogan4242@gmail.com
        </a>
        <p className="text-amber-700/60">
          Please include your account email and a description of the issue.
        </p>
      </div>
    </div>
  );
}
