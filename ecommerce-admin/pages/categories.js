import Layout from "@/components/Layout";
import axios from "axios";
import { useEffect, useState } from "react";
import { withSwal } from 'react-sweetalert2';

// categories page
function Categories({swal}){
    const [name, setName] = useState('');
    const [parentCategory, setParentCategory] = useState('');
    const [editedCategory, setEditedCategory] = useState(null);
    const [categories, setCategories] = useState([]);
    const [properties, setProperties] = useState([])

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
        const data = {name, parentCategory, 
            properties:properties.map(p => ({
                name: p.name, 
                values:p.values.split(',')
            })),
        };
        if(editedCategory) { // edit mode of existing category
            data._id = editedCategory._id
            await axios.put('/api/categories', data);
            setEditedCategory(null)
        }
        else { // creating new category in mongodb
            await axios.post('/api/categories', data);
        }
        setName('');
        setParentCategory('');
        setProperties([]);
        fetchCategories();
    }

    // edit category
    function editCategory(category){
        setEditedCategory(category);
        setName(category.name);
        setParentCategory(category.parent?._id);
        setProperties(
            category.properties.map(({name,values}) => ({
            name,
            values:values.join(',')
          }))
        );
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

    function addProperty(){
        setProperties(prev => {
            return [...prev, {name:'',values:''}];
        });
    }

    function handlePropertyNameChange(index, property, newName) {
        console.log({index, property, newName});
        setProperties(prev => {
            const properties = [...prev];
            properties[index].name = newName;
            return properties;
        })
    }

    function handlePropertyValueChange(index, property, newValues) {
        console.log({index, property, newValues});
        setProperties(prev => {
            const properties = [...prev];
            properties[index].values = newValues;
            return properties;
        })
    }

    function removeProperty(indexToRemove) {
        setProperties(prev => {
            return [...prev].filter((p, pIndex) => {
                return pIndex !== indexToRemove;
            });
        });
    }

    return (
        <Layout>
            <h1>Categories</h1>
            <label>{editedCategory 
                    ? `Edit category ${editedCategory.name}` 
                    : 'Create new category'}
            </label>
            <form onSubmit={saveCategory}>
                <div className="flex gap-1">
                    <input
                    type="text" 
                    placeholder={'Category name'} 
                    value={name} 
                    onChange={ev => setName(ev.target.value)}/>
                    <select value={parentCategory} onChange={ev => setParentCategory(ev.target.value)}>
                        <option value="">No parent category</option>
                        {categories.length > 0 && categories.map(category => (
                            <option value={category._id}>{category.name}</option>
                        ))}
                    </select>
                </div>

                <div className="mb-2">
                    <label className="block">Properties</label>
                    <button type="button" className="btn-default text-sm mb-2" onClick={addProperty}>Add new property</button>
                    {properties.length > 0 && properties.map((property, index) => (
                        <div className="flex gap-1 mb-2">
                            <input className="mb-0" type="text" 
                            value={property.name} 
                            onChange={ev => handlePropertyNameChange(index, property, ev.target.value)} 
                            placeholder="property name (example: color)"/>
                            <input className="mb-0" type="text" 
                            value={property.values} 
                            onChange={ev => handlePropertyValueChange(index, property, ev.target.value)} 
                            placeholder="values, comma separated"/>
                            <button onClick={() => removeProperty(index)} type="button" className="btn-default">Remove</button>
                        </div>
                    ))}
                </div>


                <div className="flex gap-1">
                    {editedCategory && (
                        <button type="button" 
                        onClick={() => {setEditedCategory(null); setName(''); setParentCategory(''); setProperties([]);}} 
                        className="btn-default">
                            Cancel
                        </button>
                    )}
                    <button className="btn-primary py-1" type={'submit'}>Save</button>
                </div>
            </form>

            {!editedCategory && (
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
            )}
            
        </Layout>
    )
}


export default withSwal(({swal}, ref) => (
    <Categories swal={swal}/>
));