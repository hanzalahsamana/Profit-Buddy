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
import { Link } from 'react-router-dom'

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
                <Link to="/">
                    <img
                        src={theme ? LightLogoImage : DarkLogoImage}
                        alt="logo"
                        className="w-[200px] cursor-pointer"
                    />
                </Link>

                <div className='flex gap-2 items-center'>
                    <ToggleSwitch options={['Dark', 'Light']} selected={theme ? 'Dark' : 'Light'} onChange={(value) => dispatch(setTheme(value === 'Dark'))} />
                    <Button size='medium' corner='full' label='Spy A Seller' action={() => setModalOpen(!modalOpen)} />
                </div>

            </div>
            <div className='inline flex-col  flex-1'>
                <SearchProducts />
            </div>
            <Modal
                isOpen={modalOpen}
                setIsOpen={setModalOpen}
                label='SPY A Seller'
                subText='Search sellers by thier ID'
                actions={<>
                    <Button label='Cancel' size='medium' variant='outline' />
                    <Button type='submit' label='SPY A SELLER' size='medium' variant='secondary' action={handleSubmit} />
                </>}>
                <form onSubmit={handleSubmit}>
                    <CustomInput label={'Search Seller'} value={sellerId} onChange={(e) => setSellerId(e.target.value)} error={inputError} prefix={'Seller Id'} />
                    <button type='submit' className='hidden'></button>
                </form>
            </Modal>
        </div>
    )
}

export default Header