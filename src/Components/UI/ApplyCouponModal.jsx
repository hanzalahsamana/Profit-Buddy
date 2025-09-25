import { useState } from 'react'
import Modal from './Modal'
import CustomInput from '../Controls/CustomInput'
import Button from '../Controls/Button'
import { createSubscription } from '../../Apis/Subscription'
import { setUserSubscription } from '../../Redux/Slices/UserSlice'
import { useDispatch } from 'react-redux'
import { COUPON_CODE_PREFIX } from '../../Enums/Enums'

const ApplyCouponModal = ({ isOpen, setIsOpen }) => {
    const [loading, setLoading] = useState(false)
    const [couponCodeStatus, setCouponCodeStatus] = useState({ success: false, message: '' })
    const [error, setError] = useState('')
    const [couponCode, setCouponCode] = useState('')

    const dispatch = useDispatch()


    const handleApplyCoupon = async () => {
        setError('')
        setCouponCodeStatus({ success: false, message: '' })

        if (!couponCode) {
            return setError('Please enter a valid coupon code')
        }
        setLoading(true)
        try {
            const data = await createSubscription({ couponCode: `${COUPON_CODE_PREFIX}${couponCode}` })
            dispatch(setUserSubscription(data?.subscription))
            setCouponCodeStatus({ success: true, message: data?.message })
        } catch (err) {
            console.error(err);
            const message = err.response ? err.response.data.message : err.message
            setCouponCodeStatus({ success: false, message })
        } finally {
            setLoading(false)
        }
    }

    const onClose = () => {
        setCouponCodeStatus({ success: false, message: '' })
        setError('')
    }

    return (
        <Modal
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            label={'Apply Coupon'}
            subText='Have a coupon? Apply it here.'
            extraFuntion={onClose}
            actions={<>
                <Button label='Cancel' size='medium' variant='outline' action={() => { onClose(); setIsOpen(false) }} />
                <Button
                    type='button'
                    label={'Apply Coupon'}
                    size='medium'
                    variant='secondary'
                    loading={loading}
                    action={handleApplyCoupon}
                />
            </>}
        >
            <div className='flex flex-col gap-3'>
                {couponCodeStatus?.message && (
                    <div className={`flex flex-col gap-4 text-sm  py-2 px-4 rounded-lg font-normal ${couponCodeStatus?.success ? 'bg-green-100 text-green-500' : 'bg-red-100 text-red-500'} `}>
                        {couponCodeStatus?.message}
                    </div>
                )}

                <CustomInput
                    prefix={COUPON_CODE_PREFIX}
                    label={'Coupon Code'}
                    placeholder={"e.g. CARTTON"}
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    error={error}
                />
            </div>
        </Modal>
    )
}

export default ApplyCouponModal
