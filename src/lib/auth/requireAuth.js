import { getSession } from "next-auth/react";

export async function requireAuth(context) {
  const session = await getSession(context);
  console.log("session in SSR: ", session);
  if (!session) {
    return {
      redirect: {
        destination: "/auth/login",
        permanent: false,
      },
    };
  }

  return { props: { session } };
}
