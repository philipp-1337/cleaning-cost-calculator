
const Spinner: React.FC = () => {
  return (
    <div className="flex justify-center items-center min-h-[80px]">
      <div
        className="animate-spin h-12 w-12 rounded-full border-4 border-t-blue-500 border-b-blue-400 border-l-blue-300 border-r-blue-200"
        style={{
          animationTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      ></div>
    </div>
  );
};

export default Spinner;