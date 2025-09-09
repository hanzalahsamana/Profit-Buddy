import { useState } from 'react'
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa'
import LightLogoImage from '../../Assets/Profit Buddy AI/Sign/PNG/Black Sign.png'
import CustomInput from './../Controls/CustomInput';
import Checkbox from './../Controls/Checkbox';
import Button from './../Controls/Button';
import { loginUser } from '../../Apis/User';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: "" });
    };

    const validateForm = () => {
        const newErrors = {};

        // email validation
        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = "Invalid email format";
        } else if (/\s/.test(formData.email)) {
            newErrors.email = "Email must not contain spaces";
        }

        // password validation
        if (!formData.password.trim()) {
            newErrors.password = "Password is required";
        } else if (formData.password.length < 6) {
            newErrors.password = "Password must be at least 6 characters";
        } else if (!/^[\w!@#$%^&*()_+=[\]{};':"\\|,.<>/?-]+$/.test(formData.password)) {
            newErrors.password = "Password contains invalid characters";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (!validateForm()) return;
            setLoading(true)
            await loginUser(formData)
            navigate("/")
        } catch (error) {
            setLoading(false)
            toast.error(error.response ? error.response.data.message : error.message);
        }
    };

    return (
        <div className='flex items-center w-screen hideScroll h-screen justify-center bg-lBackground px-4'>
            <form
                className='flex flex-col gap-4 w-full px-5 py-8 max-w-[400px] bg-primary shadow-md rounded-xl border border-border'
                onSubmit={handleSubmit}
            >
                <div className='flex items-center justify-center'>
                    <img src={LightLogoImage} alt="" className='w-[60px]' />
                </div>
                <div className='flex flex-col items-center'>
                    <p className='text-secondary text-center font-bold text-2xl/[26px]'>Welcome back</p>
                    <p className='text-lText text-center font- text-sm'>Please enter your details to login</p>
                </div>

                <CustomInput
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="abc@example.com"
                    label="Email"
                    inputClassName="!rounded-xl"
                    error={errors.email}
                />

                <CustomInput
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    label="Password"
                    inputClassName="!rounded-xl"
                    error={errors.password}
                    suffix={
                        <Button
                            variant="transparent"
                            label={showPassword ? <FaRegEye /> : <FaRegEyeSlash />}
                            action={() => setShowPassword(!showPassword)}
                            className="!px-3 !text-base"
                        />
                    }
                />

                <Button
                    corner="small"
                    label="Login"
                    variant="secondary"
                    size="medium"
                    className="!h-10 !rounded-xl"
                    type="submit"
                    loading={loading}
                />

                <p className="text-sm text-lText text-center">
                    Don’t have an account?{" "}
                    <Link
                        to={'/authentication?tab=register'}
                        className="text-accent cursor-pointer font-medium hover:text-accent/70 transition"
                    >
                        Sign up here
                    </Link>
                </p>
            </form>
        </div>
    )
}

export default Login
