import Featured from "@/components/Featured";
import Header from "@/components/Header";
import { mongooseConnect } from "@/lib/mongoose";

import { Product } from "@/models/Product";

export default function HomePage({product}) {
  return (
    <div>
      <Header />
      <Featured product={product}/>
    </div>
  )
}

export async function getServerSideProps(){
  const featuredProductId = '6500f4a56eb878a3b7be5eb9';
  await mongooseConnect();
  const product = await Product.findById(featuredProductId);
  return {
    // parse the string to an object in JSON
    props: {product: JSON.parse(JSON.stringify(product))},
  }
}