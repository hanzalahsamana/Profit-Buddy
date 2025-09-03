import React from 'react'
import Button from '../Controls/Button'
import { IoHome } from 'react-icons/io5'
import CustomCard from '../UI/CustomCard'
import { redirectToSellerCentralAddProduct, redirectToSellerCentralHome, redirectToSellerCentralInventory, redirectToSellerCentralOrders } from '../../Helpers/Redirects'

const SellerCentral = ({ product }) => {
    return (
        <CustomCard label={'Seller Central'}>
            <div className='flex gap-2 items-center'>
                <Button action={(e) => redirectToSellerCentralHome(e)} size='medium' className='!px-5' variant='secondary' label={<IoHome size={16} />} />
                <Button action={(e) => redirectToSellerCentralAddProduct(e, product?.asin)} size='medium' className='!px-5' variant='secondary' label='Add Product' />
                <Button action={(e) => redirectToSellerCentralInventory(e, product?.asin)} size='small' className='!px-5' variant='secondary' label='Inventory' />
                <Button action={(e) => redirectToSellerCentralOrders(e, product?.asin)} size='medium' className='!px-5' variant='secondary' label='Orders' />
            </div>
        </CustomCard>
    )
}

export default SellerCentral