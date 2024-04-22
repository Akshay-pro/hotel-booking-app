const Footer = () => {
  return (
    <div className="bg-red-800 py-5">
        <div className="container mx-auto flex justify-between items-center px-2">
            <span className="text-3xl min-[360px]:text-xl text-white font-bold tracking-tight">Holiday.com</span>
            <span className="text-white font-bold tracking-tight flex gap-4">
                <p className="cursor-pointer">Privacy Policy</p>
                <p className="cursor-pointer">Terms of Service</p>
            </span>
        </div>
    </div>
  )
}

export default Footer