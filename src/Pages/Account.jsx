import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FiUser, FiCreditCard, FiDollarSign, FiSettings, FiUsers, FiHelpCircle } from "react-icons/fi";

import ProfileTab from "../Components/Widgets/ProfileTab";
import SubscriptionTab from '../Components/Widgets/SubscriptionTab';
import BillingTab from '../Components/Widgets/BillingTab';
import SettingsTab from "../Components/Widgets/SettingsTab";
import UsersLoginTab from "../Components/Widgets/UsersLoginTab";
import SupportTab from "../Components/Widgets/SupportTab";

import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";

const tabs = [
  { name: "Profile", value: "profile", icon: FiUser },
  { name: "Subscription", value: 'subscription', icon: FiCreditCard },
  { name: "Billing", value: 'billing', icon: FiDollarSign },
  { name: "Settings", value: 'settings', icon: FiSettings },
  { name: "Users", value: 'logins', icon: FiUsers },
  { name: "Support", value: 'support', icon: FiHelpCircle },
];

const Account = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const tabParam = searchParams.get("tab");

  const [activeTab, setActiveTab] = useState(tabParam || 'profile');

  useEffect(() => {
    setActiveTab(tabParam || 'profile');
  }, [tabParam]);

  return (
    <div className="bg-lBackground min-h-screen w-[100%] relative flex flex-col gap-7 px-4 py-8 md:px-10">
      <button
        onClick={() => navigate("/")}
        className="flex items-center justify-end w-max gap-2 cursor-pointer text-secondary hover:opacity-75 transition-all"
      >
        <IoArrowBack strokeWidth={4} size={24} />
        <p className="text-[28px]/[28px] font-semibold">Manage Account</p>
      </button>

      <div className="w-[100%] flex justify-around hideScroll relative overflow-x-auto !overflow-y-hidden items-center border bg-primary border-border min-h-[50px] max-h-[50px] rounded-xl">
        {tabs.map(({ name, value, icon: Icon }) => (
          <Link
            key={value}
            className="relative flex-1  px-3 flex  items-center justify-center whitespace-nowrap cursor-pointer py-[14.7px]"
            to={`/account?tab=${value}`}
          >
            <Icon
              size={18}
              className={`mr-2 ${activeTab === value ? "text-accent" : "text-lText"}`}
            />
            <span
              className={`text-sm ${activeTab === value ? "text-accent font-semibold" : "text-lText"}`}
            >
              {name}
            </span>

            {activeTab === value && (
              <motion.div
                layoutId="activeIndicator"
                className="absolute bottom-0 left-0 right-0 h-[2px] bg-accent rounded-full"
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            )}
          </Link>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'profile' && <ProfileTab />}
      {activeTab === 'subscription' && <SubscriptionTab />}
      {activeTab === 'billing' && <BillingTab />}
      {activeTab === 'settings' && <SettingsTab />}
      {activeTab === 'logins' && <UsersLoginTab />}
      {activeTab === 'support' && <SupportTab />}
    </div>
  );
};

export default Account;
