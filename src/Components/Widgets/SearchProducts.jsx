import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import CustomInput from '../Controls/CustomInput'
import { IoSearch } from 'react-icons/io5'
import { setCurrentPage, setSearchTerm } from '../../Redux/Slices/ProductSlice'

const SearchProducts = () => {

    const { productsLoading } = useSelector((state) => state?.products)
    const [searchQuery, setSearchQuerry] = useState()
    const dispatch = useDispatch()

    const handleSearchProducts = async (e) => {
        e.preventDefault();
        
        if (productsLoading) return
        dispatch(setSearchTerm(searchQuery))
        dispatch(setCurrentPage(0))
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