import Hero from "@/components/Hero";
import LoginButton from "@/components/LoginButton";

export default function Home() {
  return (
    <main>
      <div className="absolute top-4 right-4 z-50">
        <LoginButton />
      </div>
      <Hero />
    </main>
  );
}
