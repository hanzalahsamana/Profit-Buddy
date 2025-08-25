import clsx from "clsx";
import ButtonLoader from '../Loaders/ButtonLoader'

const Button = ({
    label = '',
    variant = 'accent',
    size = 'small',
    corner = "small",
    action = () => { },
    loading = false,
    className = '',
    type = 'button',
}) => {

    const variantsClasses = {
        primary: `border-[1.5px] border-primary bg-primary text-secondary`,
        secondary: `border-[1.5px] border-secondary bg-secondary text-primary`,
        accent: `border-[1.5px] border-accent bg-accent text-primary`,
        danger: `border-[1.5px] border-red-600 bg-red-600 text-white`,
        warn: `border-[1.5px] border-yellow-600 bg-yellow-600 text-white`,
        disable: `border-[1.5px] border-gray-200 bg-gray-200 text-gray-600 !cursor-not-allowed`,
        outline: `border-[1.5px] border-border bg-primary text-secondary/70`,
        text: `text-secondary`,
    }

    const sizeClasses = {
        large: `py-2 px-6 text-lg font-medium`,
        medium: `py-2 px-8 text-sm font-medium`,
        small: `py-1.5 px-6 w-max text-sm font-medium`,
    }

    const cornerClasses = {
        none: `rounded-none`,
        small: `rounded-md`,
        full: `rounded-full`
    }


    return (
        <button
            type={type}
            onClick={action}
            disabled={loading}
            className={clsx(
                "fontDmmono relative cursor-pointer hover:opacity-95 box-border ",
                variantsClasses?.[variant],
                sizeClasses?.[size],
                cornerClasses?.[corner],
                className
            )}
        >
            {label && (
                <span className={clsx(loading ? "invisible" : "visible", "text-nowrap")}>
                    {label}
                </span>
            )}

            {loading && (
                <span className="absolute inset-0 flex items-center justify-center">
                    <ButtonLoader />
                </span>
            )}
        </button>
    )
}

export default Button