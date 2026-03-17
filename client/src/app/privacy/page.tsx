export default function PrivacyPage() {
  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-display text-amber-900 mb-6">Privacy Policy</h1>
      <div className="prose prose-amber text-amber-800/80 space-y-4 text-sm">
        <p>
          Dinner Table stores your recipes, restaurants, and meal history in a private
          MongoDB database. Your data is not shared with third parties.
        </p>
        <p>
          If you sign in with Google, we store your name and email address to identify
          your account. If you use email/password, we store a hashed version of your
          password (never the plain-text password).
        </p>
        <p>
          You can request deletion of your account and all associated data by contacting
          the app administrator.
        </p>
      </div>
    </div>
  );
}
