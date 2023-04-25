function Raises() {
    return (
      <div className="px-4 grid items-center justify-center w-screen max-w-5xl grid-cols-3 gap-10">
        {/* Single Card */}
        <div className="hover:-translate-y-1 hover:scale-110 flex-col w-full col-span-3 prose sm:col-span-1">
          <div className="z-20 -mb-3 text-center">
            <span className="inline-block text-base antialiased font-bold bg-white max-w-[80%]">
              Presale Round #1
            </span>
          </div>
          <div className="animate-border rounded-xl bg-white from-teal-300 via-purple-300 to-pink-300 bg-[length:400%_400%] p-1 transition bg-gradient-to-r shadow-xl focus:outline-none focus:ring ">
            <div className="bg-white w-full h-full rounded-[11px] p-6">
              <div className="text-center">
                <span className="block text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-violet-500">
                  5%
                </span>
                <p className="font-bold">Target:$500,000</p>
                <p className="font-bold">Tokens vested and will unlock over 12 months.</p>
                <p>
                  Funds raised will be deposited into the trading fund, directed towards
                  marketing, audits and to development of roadmap products.{" "}
                </p>
              </div>
            </div>
          </div>
        </div>
  
        {/* Single Card */}
        <div className="hover:-translate-y-1 hover:scale-110 flex-col w-full col-span-3 prose sm:col-span-1">
          <div className="z-20 -mb-3 text-center">
            <span className="inline-block text-base antialiased font-bold bg-white max-w-[80%]">
              Presale Round #2
            </span>
          </div>
          <div className="animate-border rounded-xl bg-white from-teal-400 via-purple-400 to-pink-400 bg-[length:400%_400%] p-1 transition bg-gradient-to-r shadow-xl focus:outline-none focus:ring ">
            <div className="bg-white w-full h-full rounded-[11px] p-6 prose">
              <div className="text-center">
                <span className="block text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-violet-500">
                  30%
                </span>
                <p className="font-bold">Target:$6,000,000</p>
                <p className="font-bold">Tokens vested and will unlock over 12 months.</p>
                <p>
                  85% of the funds will be deposited into the{" "}
                  <span className="font-bold">QuantiFi Investor Fund</span>. 15% of the funds will be used to cover costs associated with building the protocol.
                </p>
              </div>
            </div>
          </div>
        </div>
  
        {/* Single Card */}
        <div className="hover:-translate-y-1 hover:scale-110 flex-col w-full col-span-3 prose sm:col-span-1">
          <div className="z-20 -mb-3 text-center">
            <span className="inline-block text-base antialiased font-bold bg-white w-full max-w-[80%] ">
              DEX Trading Launch
            </span>
          </div>
          <div className="animate-border rounded-xl bg-white from-teal-500 via-purple-500 to-pink-500 bg-[length:400%_400%] p-1 transition bg-gradient-to-r shadow-xl focus:outline-none focus:ring ">
            <div className="bg-white w-full h-full rounded-[11px] p-6 prose">
              <div className="text-center">
                <span className="block text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-violet-600">
                  15% + 10%
                </span>
                <p className="font-bold">Target:$6,000,000</p>
                <p className="font-bold">No vesting - tokens available at sale close.</p>
                <p>
                  Raised funds will be paired with 10% of QNTFI supply to create a
                  DEX trading pool.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  export default Raises;