import clientPromise from '@/lib/mongodb'
import { MongoDBAdapter } from '@auth/mongodb-adapter'
import NextAuth, { getServerSession } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'

const adminEmail = process.env.ADMIN_EMAIL

export const authOptions = {
    providers: [
      // OAuth authentication providers...
      GoogleProvider({
        clientId: process.env.GOOGLE_ID,
        clientSecret: process.env.GOOGLE_SECRET
      }),
    ],
    adapter: MongoDBAdapter(clientPromise),
    callbacks: {
      session: ({session, token, user}) => {
        if(adminEmail === (session?.user?.email)){
          // console.log(session.user.email)
          // console.log("ENV: " + adminEmail)
          return session;
        }
        else{
          return false;
        }
      }
    }
}

export default NextAuth(authOptions);

export async function isAdminRequest(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (!adminEmail === (session?.user?.email)){
    res.status(401);
    res.end();
    throw 'not an admin';
  }
}