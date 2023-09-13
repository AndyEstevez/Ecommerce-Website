import Featured from "@/components/Featured";
import Header from "@/components/Header";
import NewProducts from "@/components/NewProducts";
import { mongooseConnect } from "@/lib/mongoose";

import { Product } from "@/models/Product";

export default function HomePage({featuredProduct, newProducts}) {
  return (
    <div>
      <Header />
      <Featured product={featuredProduct}/>
      <NewProducts products={newProducts}/>
    </div>
  )
}

export async function getServerSideProps(){
  const featuredProductId = '6500f4a56eb878a3b7be5eb9';
  await mongooseConnect();
  const featuredProduct = await Product.findById(featuredProductId);
  const newProducts = await Product.find({}, null, {sort: {'_id': -1}, limit:10})
  return {
    // parse the string to an object in JSON
    props: {featuredProduct: JSON.parse(JSON.stringify(featuredProduct)),
            newProducts: JSON.parse(JSON.stringify(newProducts)),
          },
  }
}