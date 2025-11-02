import ContactUs from "./ContactUs";

export default async function Page() {
  // Simulate fetching user data (SSR)
  // const res = await fetch("https://api.example.com/user", { cache: "no-store" });
  // const user = await res.json();

  // const data = {
  //   name: "Alex Johnson",
  //   email: "alex@example.com",
  //   phone: "+1 234 567 890",
  //   location: "New York, USA",
  // };

  return <ContactUs />;
}
