import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import { clientPromise } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import bcrypt from "bcryptjs";
import { seedNewUser } from "@/lib/seed-user";

const TRIAL_DAYS = 30;

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: MongoDBAdapter(clientPromise),
  session: { strategy: "jwt" },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const email = credentials?.email as string | undefined;
        const password = credentials?.password as string | undefined;
        if (!email || !password) return null;

        const db = (await clientPromise).db();
        const user = await db.collection("users").findOne({ email: email.toLowerCase() });
        if (!user?.password) return null;

        const valid = await bcrypt.compare(password, user.password as string);
        if (!valid) return null;

        return {
          id: user._id.toString(),
          email: user.email as string,
          name: (user.name as string) ?? null,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account, trigger }) {
      if (user?.id) {
        token.id = user.id;

        const db = (await clientPromise).db();
        const dbUser = await db.collection("users").findOne({ _id: new ObjectId(user.id) });

        // First-time sign-in (Google OAuth or credentials): set trial if missing
        if (!dbUser?.trialEndsAt) {
          const trialEndsAt = new Date(Date.now() + TRIAL_DAYS * 24 * 60 * 60 * 1000);
          await db.collection("users").updateOne(
            { _id: new ObjectId(user.id) },
            { $set: { trialEndsAt, subscriptionStatus: "trialing" } }
          );
          token.trialEndsAt = trialEndsAt.toISOString();
          token.subscriptionStatus = "trialing";
          await seedNewUser(db, user.id);
        } else {
          token.trialEndsAt = dbUser.trialEndsAt instanceof Date
            ? dbUser.trialEndsAt.toISOString()
            : String(dbUser.trialEndsAt);
          token.subscriptionStatus = (dbUser.subscriptionStatus as string) ?? "trialing";
        }
      }

      // Session refresh (e.g. after Stripe checkout)
      if (trigger === "update" && token.id) {
        const db = (await clientPromise).db();
        const dbUser = await db.collection("users").findOne({ _id: new ObjectId(token.id as string) });
        if (dbUser) {
          token.subscriptionStatus = (dbUser.subscriptionStatus as string) ?? "trialing";
          token.trialEndsAt = dbUser.trialEndsAt instanceof Date
            ? dbUser.trialEndsAt.toISOString()
            : String(dbUser.trialEndsAt ?? "");
        }
      }

      return token;
    },
    session({ session, token }) {
      if (token?.id) session.user.id = token.id as string;
      session.user.subscriptionStatus = token.subscriptionStatus as string;
      session.user.trialEndsAt = token.trialEndsAt as string;
      return session;
    },
  },
  pages: {
    signIn: "/",
  },
});
