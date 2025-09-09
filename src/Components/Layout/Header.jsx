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
import { BiLogOut } from "react-icons/bi";
import { Link, useNavigate } from 'react-router-dom'
import { isSellerId } from '../../Utils/NumberUtil'
import { setLogout } from '../../Redux/Slices/UserSlice'
import { LuHistory } from 'react-icons/lu'

const Header = () => {

    const { theme } = useSelector((state) => state.system)
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [modalOpen, setModalOpen] = useState(false)

    const [sellerId, setSellerId] = useState('');
    const [inputError, setInputError] = useState('');

    const getSellerIdError = (sellerId) => {
        if (!sellerId?.trim()) return "Please fill the input";
        if (!isSellerId(sellerId)) return "Please enter a valid Seller ID (e.g., A1Z5U5O7R7H3DQ)";
        return null;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const error = getSellerIdError(sellerId);
        if (error) {
            setInputError(error);
            return;
        }
        setInputError("");
        window.location.href = `/sellerProfile?sellerid=${encodeURIComponent(sellerId.trim())}`;
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
                    <Button size='medium' corner='full' label='Store Spy' action={() => setModalOpen(!modalOpen)} />
                    <Button size='medium' corner='full' className='!pl-2 pr-3' label={<div className='flex gap-2 items-center'><LuHistory size={18} /> History</div>} action={() => navigate('/history')} />
                    <Button size='medium' className='!pl-2 pr-3' label={<BiLogOut size={20} />} action={() => dispatch(setLogout())} />
                </div>

            </div>
            <div className='inline flex-col  flex-1'>
                <SearchProducts />
            </div>
            <Modal
                isOpen={modalOpen}
                setIsOpen={setModalOpen}
                label='Store Spy'
                subText="Enter a Seller ID to find and analyze store details, including products, performance, and other insights."
                actions={<>
                    <Button label='Cancel' size='medium' variant='outline' action={() => setModalOpen(false)} />
                    <Button type='submit' label='Store Spy' size='medium' variant='secondary' action={handleSubmit} />
                </>}>
                <form onSubmit={handleSubmit}>
                    <CustomInput size='large' placeholder={'e.g. A1Z5U5O7R7H3DQ'} value={sellerId} onChange={(e) => setSellerId(e.target.value)} error={inputError} prefix={'Seller Id'} />
                    <button type='submit' className='hidden'></button>
                </form>
            </Modal>
        </div>
    )
}

export default Header