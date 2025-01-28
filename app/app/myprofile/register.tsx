const Register = () => {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        {/* Main content */}
        <main className="flex flex-grow items-center justify-center bg-white">
          <div
            className="text-center flex flex-col justify-center items-center"
            style={{ transform: "translateY(-50%)" }}
          >
            <p className="text-gray-700 text-lg mb-12">
              In order to track your donations information and your progress on <br /> 
              Go Stark Me, you will need to create a profile.
            </p>
            <button
              className="bg-[#0C0C4F] text-white py-4 px-12 rounded-[10px] shadow-md hover:shadow-lg hover:bg-[#0b0b47] transition-all"
              style={{
                width: "200px",
                height: "60px",
                boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
              }}
            >
              Register
            </button>
          </div>
        </main>
      </div>
    );
  };
  
  export default Register;
  