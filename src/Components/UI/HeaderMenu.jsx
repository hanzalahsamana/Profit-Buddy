import React from 'react'
import PopupMenu from '../Controls/PopupMenu'
import Button from '../Controls/Button'
import ToggleSwitch from '../Controls/ToggleSwitch'
import { setTheme } from '../../Redux/Slices/SystemSlice'
import { useState } from 'react'
import { BiLogOut } from "react-icons/bi";
import { setLogout } from '../../Redux/Slices/UserSlice'
import { LuHistory, LuUserRound } from 'react-icons/lu'
import { TbSpy } from 'react-icons/tb'
import { MdOutlineDarkMode, MdOutlineLightMode, MdOutlineNightlight } from 'react-icons/md'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { IoChevronDownOutline } from 'react-icons/io5'
import Modal from './Modal'
import CustomInput from '../Controls/CustomInput'
import { isSellerId } from '../../Utils/NumberUtil'

const HeaderMenu = () => {
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
        <div className="flex gap-2 items-center">
            {/* --- Visible ONLY on small screens (<md) --- */}
            <div className=" gap-2 md:flex hidden">
                <ToggleSwitch
                    options={['Dark', 'Light']}
                    selected={theme ? 'Dark' : 'Light'}
                    onChange={(value) => dispatch(setTheme(value === 'Dark'))}
                />
                <Button
                    size="medium"
                    variant="accent"
                    corner="full"
                    label={
                        <div className="flex gap-2 items-center">
                            <TbSpy size={18} /> Store Spy
                        </div>
                    }
                    action={() => setModalOpen(!modalOpen)}
                />
            </div>
            <Button size='medium' variant='accent' corner='small' className='!pl-4 pr-4 rounded-r-none !cursor-not-allowed' label={<div className='flex gap-2 items-center'><LuUserRound size={18} /> Profile</div>} action={() =>{}} />
            {/* --- Dropdown Menu (always visible, but with conditional items) --- */}
            <div className=" hidden md:block">
                <PopupMenu
                    trigger={
                        <Button
                            size="medium"
                            variant="accent"
                            corner="small"
                            className="!pl-2 !pr-2 -ml-2 rounded-l-none"
                            label={<div className='flex gap-2 items-center'><IoChevronDownOutline size={18} /></div>}
                        />
                    }
                    data={[
                        {
                            icon: <LuHistory size={18} />,
                            name: 'History',
                            action: () => navigate('/history'),
                        },
                        {
                            icon: <BiLogOut size={18} />,
                            name: 'Logout',
                            action: () => dispatch(setLogout()),
                        },
                    ]}
                />
            </div>

            <div className="md:hidden block">
                <PopupMenu
                    trigger={
                        <Button
                            size="medium"
                            variant="accent"
                            corner="small"
                            className="!pl-2 !pr-2 -ml-2 rounded-l-none"
                            label={<div className='flex gap-2 items-center'><IoChevronDownOutline size={18} /></div>}
                        />
                    }
                    data={[
                        {
                            icon: <TbSpy size={18} />,
                            name: 'Store Spy',
                            action: () => setModalOpen(!modalOpen),
                        },
                        {
                            icon: !theme ? (
                                <MdOutlineDarkMode size={18} />
                            ) : (
                                <MdOutlineLightMode size={18} />
                            ),
                            name: !theme ? 'Dark Theme' : 'Light Theme',
                            action: (value) => dispatch(setTheme(!theme)),
                        },
                        {
                            icon: <LuHistory size={18} />,
                            name: 'History',
                            action: () => navigate('/history'),
                        },
                        {
                            icon: <BiLogOut size={18} />,
                            name: 'Logout',
                            action: () => dispatch(setLogout()),
                        },
                    ]}
                />
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

export default HeaderMenu