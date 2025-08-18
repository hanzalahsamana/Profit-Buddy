import CustomInput from '../Controls/CustomInput'
import { IoSearch } from 'react-icons/io5'
import LightLogoImage from '../../Assets/Profit Buddy AI/Logo/PNG/White.png'
import DarkLogoImage from '../../Assets/Profit Buddy AI/Logo/PNG/Primary.png'
import ToggleSwitch from '../Controls/ToggleSwitch'
import { useDispatch, useSelector } from 'react-redux'
import { setTheme } from '../../Redux/Slices/SystemSlice'
import SearchProducts from '../Widgets/SearchProducts'
import Button from '../Controls/Button'
import Modal from '../UI/Modal'
import { useState } from 'react'

const Header = () => {

    const { theme } = useSelector((state) => state.system)
    const dispatch = useDispatch()
    const [modalOpen, setModalOpen] = useState(false)

    const [sellerId, setSellerId] = useState('');
    const [inputError, setInputError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (sellerId.trim()) {
            setInputError('');
            window.location.href = `/sellerProfile?sellerid=${encodeURIComponent(sellerId.trim())}`;
        } else {
            setInputError('Please fill the input');
        }
    };

    return (
        <div className='w-full bg-primary p-4 border-b border-border flex flex-col gap-6 '>
            <div className='flex justify-between'>

                <img src={theme ? LightLogoImage : DarkLogoImage} alt="" className='w-[200px]' />
                <div className='flex gap-2 items-center'>
                    <ToggleSwitch options={['Dark', 'Light']} selected={theme ? 'Dark' : 'Light'} onChange={(value) => dispatch(setTheme(value === 'Dark'))} />
                    <Button size='small' label='SPY A SELLER' action={() => setModalOpen(!modalOpen)} />
                </div>

            </div>
            <div className='inline flex-col  flex-1'>
                <SearchProducts />
            </div>
            <Modal isOpen={modalOpen} setIsOpen={setModalOpen}>
                <div className='p-4'>
                    <h1 className='w-full text-center text-secondary text-[32px] font-semibold fontDmmono'>SPY A SELLER</h1>
                    <p className='text-lText pb-2 pt-4'>Search Sellers by thier id</p>
                    <form onSubmit={handleSubmit}>

                        <CustomInput value={sellerId} onChange={(e) => setSellerId(e.target.value)} error={inputError} prefix={'Seller Id'} />
                        <Button label='SPY A SELLER' size='large' className='w-full my-6 opacity-90' />
                    </form>
                </div>
            </Modal>
        </div>
    )
}

export default Header