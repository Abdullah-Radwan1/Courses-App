import Image from "next/image";

export default function Loading() {
  return (
    <div className="flex justify-center items-center">
      <Image alt="loader" width={100} height={100} src="/loader.svg" />
    </div>
  );
}
