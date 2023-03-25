import { signUpUser } from "./sign-up";

// export async function GET(request: Request) {
//   return new Response("Hello, Next.js!");
// }

export async function POST(request: Request) {
  const body = await request.json();
  const { username, email } = body;
  console.log("ABOVE signup");
  const data = await signUpUser(username, email);
  console.log("UNDER signup");
  console.log("----------POST function ---------");
  console.log(data);
  return new Response(JSON.stringify(data));
}
