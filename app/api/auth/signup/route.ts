import { signUpUser } from "./sign-up";

export async function POST(request: Request) {
  const body = await request.json();
  const { username, email } = body;
  const data = await signUpUser(username, email);

  console.log(data);
  return new Response(JSON.stringify(data));
}
