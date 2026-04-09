type WelcomeCardProps = {
  title?: string;
};

export default function WelcomeCard({ title = "Welcome" }: WelcomeCardProps) {
  return (
    <div className="w-full max-w-fit mx-auto px-6 sm:px-12 py-4 rounded-full shadow-md text-center bg-gray-300">
      <h2 className="text-base sm:text-xl font-bold text-gray-800">{title}</h2>
    </div>
  );
}
