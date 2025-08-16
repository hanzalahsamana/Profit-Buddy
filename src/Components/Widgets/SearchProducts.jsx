import React, { useState } from 'react'
import Button from '../Controls/Button'
import { searchProducts } from '../../Apis/product'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import CustomInput from '../Controls/CustomInput'
import { IoSearch } from 'react-icons/io5'

const SearchProducts = () => {

    const { products, productsLoading } = useSelector((state) => state?.products)
    const [searchQuery, setSearchQuerry] = useState()

    const handleSearchProducts = async (e) => {
        e.preventDefault();
        if (productsLoading) return
        try {
            await searchProducts(searchQuery); // use the state value
            toast.success('Fetched successfully!');
        } catch (error) {
            
            // toast.error(error.response ? error.response.data.message : error.message);
        }
    };

    return (
        <form onSubmit={handleSearchProducts}>
            <p className='text-lText text-[15px] mb-2'>
                Search Product with their Keywords, Asins or Product Code
            </p>
            <div className='flex item-start gap-2'>

                <CustomInput
                    value={searchQuery}
                    onChange={(e) => setSearchQuerry(e.target.value)}
                    placeholder={'e.g. #B0053HBJBE OR Watch'}
                    prefix={
                        <button
                            type="submit"
                            disabled={productsLoading}
                            className="flex items-center gap-2 !cursor-pointer focus:outline-none"
                        >
                            <IoSearch /> search
                        </button>
                    }
                />
            </div>
        </form>
    )
}

export default SearchProducts