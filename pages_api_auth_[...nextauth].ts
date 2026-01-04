import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "kminchelle" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          // DummyJSON login requires: username and password
          const res = await axios.post("https://dummyjson.com/auth/login", {
            username: credentials?.username,
            password: credentials?.password
          });
          const data = res.data;
          // data contains token and user fields (DummyJSON returns token + user info)
          if (data && data.token) {
            // Store token inside the returned user object to be available in session callbacks
            return { id: data.id, name: data.username, email: data.email, token: data.token, raw: data };
          }
          return null;
        } catch (err) {
          console.error("Auth error", err);
          return null;
        }
      }
    })
  ],
  session: {
    strategy: "jwt"
  },
  callbacks: {
    // Persist token into JWT
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = (user as any).token || token.accessToken;
        token.user = user;
      }
      return token;
    },
    async session({ session, token }) {
      // Expose token on session for client use
      (session as any).accessToken = token.accessToken;
      session.user = token.user || session.user;
      return session;
    }
  },
  pages: {
    signIn: "/login"
  },
  secret: process.env.NEXTAUTH_SECRET || "dev-secret"
});