import { mongooseConnect } from "@/lib/mongoose";
import { Category } from "@/models/Category";

export default async function handle(req, res) {
    const {method} = req;
    await mongooseConnect();


    // get all categories from mongodb
    if (method === 'GET'){
        res.json(await Category.find().populate('parent'));
    }

    // create category in mongodb
    if (method === 'POST') {
        const {name, parentCategory} = req.body;
        const categoryDoc = await Category.create({name, parent:parentCategory || undefined});
        res.json(categoryDoc);
    }

    // update category after saving edit
    if (method === 'PUT') {
        const  {name, parentCategory, _id} = req.body;
        const categoryDoc = await Category.updateOne({_id}, {
            name,
            parent: parentCategory
        });
        res.json(categoryDoc)
    }

    // delete category
    if (method === 'DELETE') {
        const {_id} = req.query;
        await Category.deleteOne({_id});
        res.json('ok')
    }


}