type PremiumBook3DProps = {
  cover?: string;
};

export default function PremiumBook3D({
  cover = "/assets/book-cutout.webp",
}: PremiumBook3DProps) {
  return (
    <div className="relative flex items-center justify-center">
      <img
        src={cover}
        alt="Book"
        className="w-full max-w-md"
      />
    </div>
  );
}