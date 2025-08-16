import React from 'react'
import ButtonLoader from '../Loaders/ButtonLoader'

const Button = ({
    label = '',
    variant = 'primary',
    size = 'large',
    action = () => { },
    loading = false,
    className = ''
}) => {

    const variantsClasses = {
        primary: `bg-accent text-black`,
    }

    const sizeClasses = {
        large: `py-2 px-4 rounded-md text-lg`,
        small: `py-2 px-4 rounded-md text-[14px]`,
    }


    return (
        <button type='submit' onClick={action} disabled={loading} className={`relative font-medium cursor-pointer hover:opacity-85 ${variantsClasses?.[variant]} ${sizeClasses?.[size]} ${className}`}>
            {label && (<span className={`${loading ? 'invisible' : 'visible'} text-nowrap`}>{label}</span>)}
            {loading && (
                <span className="absolute inset-0  flex items-center justify-center">
                    <ButtonLoader />
                </span>
            )}
        </button>
    )
}

export default Button