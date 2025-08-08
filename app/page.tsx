import ProductCard from "@/components/ProductCard";

export default function Home() {
  return (
    <>
      <ProductCard product={{
          image: "/headset-photno.png",
          name: "Futuristic VR Headset",
          price: 50
        }} 
      />
    </>
  )
}
