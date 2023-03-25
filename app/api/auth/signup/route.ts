import { signUpUser } from "./sign-up";

export async function POST(request: Request) {
  const body = await request.json();
  const { username, email, userid } = body;
  const data = await signUpUser(username, email, userid);

  return new Response(JSON.stringify(data));
}
