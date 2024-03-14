

export default function Comments() {
  return (
    <div>
        <p className="text-textColor font-bold">
            Comments
        </p>
       
        <div className="bg-searchBg h-[100px] w-[65%] px-2 md:flex items-center rounded-md overflow-hidden sm:hidden" id="">
            <input id="" type="text" placeholder="Add comment here..."
                className="w-full h-full bg-transparent outline-none
                border-none text-textColor placeholder-gray-400 px-2"
                // onChange={}
            />
        </div>
    </div>
  )
}
