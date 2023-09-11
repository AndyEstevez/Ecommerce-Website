import Layout from "@/components/Layout";
import axios from "axios";
import { useEffect, useState } from "react";
import { withSwal } from 'react-sweetalert2';

// categories page
function Categories({swal}){
    const [name, setName] = useState('');
    const [categories, setCategories] = useState([]);
    const [parentCategory, setParentCategory] = useState('');
    const [editedCategory, setEditedCategory] = useState(null);

    useEffect(() => {
        fetchCategories();
    }, [])

    function fetchCategories() {
        axios.get('/api/categories').then(result => {
            setCategories(result.data);
        })
    }

    // save to mongodb
    async function saveCategory(ev) {
        ev.preventDefault();
        const data = {name, parentCategory}
        if(editedCategory) { // edit mode of existing category
            data._id = editedCategory._id
            await axios.put('/api/categories', {...data});
            setEditedCategory(null)
        }
        else { // creating new category in mongodb
            await axios.post('/api/categories', data);
        }
        setName('');
        fetchCategories();
    }

    // edit category
    function editCategory(category){
        setEditedCategory(category);
        setName(category.name);
        setParentCategory(category.parent?._id)
    }

    // delete category
    function deleteCategory(category){
        swal.fire({
            title: 'Are you sure?',
            text: `Do you want to delete ${category.name}?`,
            showCancelButton: true,
            cancelButtonText: 'Cancel',
            confirmButtonText: 'Yes, Delete!',
            confirmButtonColor: '#d55',
            reverseButtons: true
        }).then(async result => {
            if(result.isConfirmed) { // delete was selected
                const {_id} = category;
                await axios.delete('/api/categories?_id='+_id);
                fetchCategories();
            }
        }).catch(error => {

        })
    }

    return (
        <Layout>
            <h1>Categories</h1>
            <label>{editedCategory ? `Edit category ${editedCategory.name}` : 'Create new category'}</label>
            <form onSubmit={saveCategory} className="flex gap-1">
                <input className="mb-0" 
                type="text" 
                placeholder={'Category name'} 
                value={name} 
                onChange={ev => setName(ev.target.value)}/>
                <select className="mb-0" value={parentCategory} onChange={ev => setParentCategory(ev.target.value)}>
                    <option value="">No parent category</option>
                    {categories.length > 0 && categories.map(category => (
                        <option value={category._id}>{category.name}</option>
                    ))}
                </select>
                <button className="btn-primary py-1" type={'submit'}>Save</button>
            </form>

            <table className="basic mt-4">
                <thead>
                    <tr>
                        <td>Category name</td>
                        <td>Parent category</td>
                        <td></td>
                    </tr>
                </thead>
                <tbody>
                    {categories.length > 0 && categories.map(category => (
                        <tr>
                            <td>{category.name}</td>
                            <td>{category?.parent?.name}</td>
                            <td>
                                <button onClick={() => editCategory(category)} className="btn-primary mr-1">Edit</button>
                                <button onClick={() => deleteCategory(category)} 
                                className="btn-primary">Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </Layout>
    )
}


export default withSwal(({swal}, ref) => (
    <Categories swal={swal}/>
));