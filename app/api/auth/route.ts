import { signUpUser } from "./sign-up";

// export async function GET(request: Request) {
//   return new Response("Hello, Next.js!");
// }

export async function POST(request: Request) {
  const body = await request.json();
  const { username, email } = body;
  await signUpUser(username, email);
  return new Response();
}
