import avatar from '../assets/avatar.png';

export default function Profile() {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="bg-white rounded-xl shadow-sm p-8 text-center max-w-sm w-full">
        <img
          src={avatar}
          alt="John Doe"
          className="w-24 h-24 rounded-full object-cover border-4 border-[#4A8394] mx-auto mb-4"
        />
        <h2 className="text-xl font-semibold text-gray-800 mb-1">John Doe</h2>
        <p className="text-gray-500 text-sm mb-4">john.doe@ftl.co.id</p>
        <span className="inline-block bg-[#4A8394]/10 text-[#4A8394] text-xs font-medium px-3 py-1 rounded-full">
          Administrator
        </span>
      </div>
    </div>
  );
}
