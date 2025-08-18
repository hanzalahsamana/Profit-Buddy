import React from 'react'
import ButtonLoader from '../Loaders/ButtonLoader'

const   Button = ({
    label = '',
    variant = 'accent',
    size = 'small',
    corner = "small",
    action = () => { },
    loading = false,
    className = ''
}) => {

    const variantsClasses = {
        primary: `bg-primary text-secondary`,
        secondary: `bg-secondary text-primary`,
        accent: `bg-accent text-black`,
        outline:`border border-secondary text-secondary`,
        text:`text-secondary`,
    }

    const sizeClasses = {
        large: `py-2 px-4 text-lg font-medium`,
        small: `py-1.5 px-4 w-max text-[12px] font-medium`,
    }
    
    const cornerClasses = {
        none: `rounded-none`,
        small:`rounded-md`,
        full:`rounded-full`

    }


    return (
        <button type='submit' onClick={action} disabled={loading} className={`relative cursor-pointer hover:opacity-95 ${variantsClasses?.[variant]} ${sizeClasses?.[size]} ${cornerClasses?.[corner]} ${className}`}>
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