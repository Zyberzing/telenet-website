import TopUp from "./TopUp";

export default async function Page() {
  // ✅ Optionally, fetch any JSON or API data (server-side)
  // const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/data/guide.json`, {
  //   cache: "no-store", // ensures SSR every request
  // });
  // const guideData = await res.json();

  // ✅ Pass translations or other data to the client component
  return <TopUp />;
}
