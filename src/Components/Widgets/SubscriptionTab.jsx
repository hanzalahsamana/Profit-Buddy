import React, { useState } from 'react'
import { useSelector } from "react-redux";
import CustomInput from '../Controls/CustomInput';
import Button from '../Controls/Button';

const SubscriptionTab = () => {
    const { user } = useSelector((state) => state?.user);
    const [userName, setUserName] = useState('');

    return (
        <div className="w-full grid grid-cols-1 md:grid-cols-1 gap-4 h-max">
            <div className="flex flex-col gap-4  bg-primary border border-border rounded-xl p-4">
                <p className="text-2xl text-secondary/80 font-medium">Subscription</p>
              
            </div>

        </div>
    )
}

export default SubscriptionTab