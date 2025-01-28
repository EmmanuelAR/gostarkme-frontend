'use client';

import ProgressBar from '@/components/ui/ProgressBar';
import Footer from '@/components/ui/Footer';
import Navbar from '@/components/ui/Navbar';
import { walletStarknetkitLatestAtom } from '@/state/connectedWallet';
import { useAtomValue } from 'jotai';
import { navItems } from '@/constants';
import { useState } from 'react';
import { Wallet, Star, Target } from 'lucide-react'; 
import Register from './register';

const UserProfilePage = () => {
  const wallet = useAtomValue(walletStarknetkitLatestAtom);

  const [isRegistered, setIsRegistered] = useState(false);

  const totalDonations = 20000;
  const currentLevel = 10;
  const currentPoints = 300;
  const totalPoints = 500;
  const recentActivity = [
    { action: 'Donated', amount: 400 },
    { action: 'Donated', amount: 200 },
  ];

  const progress = (currentPoints / totalPoints) * 100;

  if (!wallet && !isRegistered) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar
          logoSrc={process.env.NEXT_PUBLIC_APP_ROOT + 'icons/starklogo.png'}
          logoAlt="Go Stark Me logo"
          title="Go Stark Me"
          navItems={navItems}
        />
        <Register />
        <Footer />
      </div>
    );
  }

  if (!wallet) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar
          logoSrc={process.env.NEXT_PUBLIC_APP_ROOT + 'icons/starklogo.png'}
          logoAlt="Go Stark Me logo"
          title="Go Stark Me"
          navItems={navItems}
        />
        <div className="flex justify-center items-center h-64">
          <div className="text-center text-gray-500">
            Please connect your wallet to see your profile.
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!isRegistered) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar
          logoSrc={process.env.NEXT_PUBLIC_APP_ROOT + 'icons/starklogo.png'}
          logoAlt="Go Stark Me logo"
          title="Go Stark Me"
          navItems={navItems}
        />
        <Register />
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar
        logoSrc={process.env.NEXT_PUBLIC_APP_ROOT + 'icons/starklogo.png'}
        logoAlt="Go Stark Me logo"
        title="Go Stark Me"
        navItems={navItems}
      />
      <main className="flex flex-grow flex-col items-center bg-white p-6">
        <h2 className="text-3xl font-bold text-gray-900 mb-6 w-full text-left ml-[55%]">
          {wallet?.account?.address.slice(0, 5)}...{wallet?.account?.address.slice(-4)}'s Profile ✨
        </h2>

        <div className="w-full max-w-3xl bg-white shadow rounded-lg p-8 mb-6 border border-gray-300">
          <div className="grid grid-cols-1 gap-y-6">
            <div className="flex items-center">
              <Wallet className="mr-3" size={32} color="#9370DB" /> 
              <div>
                <p
                  className="text-[16px] font-bold leading-[29.3px] text-[#8D8D8D]"
                  style={{ fontFamily: 'Helvetica Neue, sans-serif' }}
                >
                  Total donations
                </p>
                <p className="text-xl font-bold text-gray-800">
                  {totalDonations} <span className="text-yellow-500">⭐</span>
                </p>
              </div>
            </div>
            <div className="flex items-center">
              <Star className="mr-3" size={32} color="#9370DB" />
              <div>
                <p
                  className="text-[16px] font-bold leading-[29.3px] text-[#8D8D8D]"
                  style={{ fontFamily: 'Helvetica Neue, sans-serif' }}
                >
                  Current level
                </p>
                <p className="text-xl font-bold text-gray-800">
                  {currentLevel} <span className="text-yellow-500">⭐</span>
                </p>
              </div>
            </div>
          </div>
          <div className="mt-6">
            <p
              className="text-[16px] font-bold leading-[29.3px] text-[#8D8D8D] mb-1 ml-[calc(32px+0.75rem)]"
              style={{ fontFamily: 'Helvetica Neue, sans-serif' }}
            >
              Progress to next level
            </p>

            <div className="ml-[calc(32px+0.75rem)]">
              <p className="text-sm text-right text-gray-600 mb-0">
                {currentPoints}/{totalPoints} <span className="text-yellow-500">⭐</span>
              </p>
              <ProgressBar progress={progress} />
            </div>
          </div>
        </div>

        <div className="w-full max-w-3xl bg-white shadow rounded-lg p-6 border border-gray-300">
        <div className="flex items-center mb-4">
  <Target className="w-6 h-6 text-[#9370DB] mr-4" /> 
  <h3
    className="text-[20px] font-light leading-[33.85px] text-[#000000] opacity-80"
    style={{ fontFamily: 'Arial, Helvetica Neue' }}
  >
    Recent activity
  </h3>
</div>


          {recentActivity.map((activity, index) => (
            <div
              key={index}
              className="flex justify-between items-center bg-gray-200 p-3 rounded-lg mb-5 w-4/5 mx-auto"
            >
              <span
                className="text-sm text-black"
                style={{ fontFamily: 'Arial, Helvetica Neue' }}
              >
                {activity.action}
              </span>
              <span
                className="text-sm font-normal text-gray-900 flex items-center"
                style={{ fontFamily: 'Arial, Helvetica Neue' }}
              >
                {activity.amount} <span className="text-yellow-500 ml-2 text-lg">⭐</span>
              </span>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default UserProfilePage;
